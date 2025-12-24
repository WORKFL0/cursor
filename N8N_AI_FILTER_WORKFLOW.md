# 🤖 N8N AI-Powered Blog Content Workflow (MET FILTERING)

**Doel**: Automatisch FreshRSS artikelen filteren op relevantie en verrijken met AI-gegenereerde metadata.

---

## 🎯 WORKFLOW OVERZICHT (MET AI FILTER)

```
FreshRSS (NU.nl, NOS.nl, tech sites)
    ↓
1. Extract Raw Data
    ↓
2. AI Relevantie Check ← ✨ NIEUW: Filter niet-relevante artikelen
    ↓
3. Filter Node (skip irrelevant)
    ↓
4. Prepare Metadata Prompt
    ↓
5. AI Metadata Generation
    ↓
6. Merge AI Output
    ↓
7. Transform to Supabase
    ↓
8. Insert into Supabase
```

---

## 📋 COMPLETE N8N WORKFLOW

### **Node 1: FreshRSS Trigger/Fetch**
(Je hebt deze al)

---

### **Node 2: AI Relevantie Check** (Code Node)

```javascript
// Prepare relevance check prompt
const items = $input.all();

return items.map(item => {
  const rss = item.json;

  const title = rss.title || 'No title';
  const content = rss.content || rss.description || '';
  const excerpt = content.substring(0, 800); // First 800 chars
  const source = rss.link || '';

  // Create relevance check prompt
  const relevancePrompt = `Bepaal of dit nieuwsartikel RELEVANT is voor een IT services bedrijf (Workflo) dat zich richt op:
- Managed IT Services
- Cybersecurity
- Cloud Solutions (Azure, Microsoft 365)
- Networking & Infrastructure
- Business IT support

ARTIKEL BRON: ${source}
TITEL: ${title}

CONTENT PREVIEW:
${excerpt}

RELEVANTIE CRITERIA:
✅ RELEVANT als het gaat over:
- IT technologie, software, hardware
- Cybersecurity, hacking, datalekken, privacy
- Cloud computing, SaaS, Microsoft, Azure, AWS
- Bedrijfs-IT, digitalisering, automatisering
- Tech trends relevant voor bedrijven
- IT wetgeving (GDPR, NIS2, etc)
- Remote work technologie
- AI/ML voor business toepassingen

❌ NIET RELEVANT als het gaat over:
- Algemeen nieuws (politiek, economie, sport)
- Entertainment, celebrities, lifestyle
- Consumer tech zonder business angle (gaming, smartphones reviews)
- Lokaal nieuws zonder IT component
- Weer, verkeer, criminaliteit (tenzij cyber)
- Cultuur, kunst, reizen

ANTWOORD FORMAT (JSON):
{
  "is_relevant": true of false,
  "relevance_score": 0-100 (hoe relevant, 0=niet, 100=zeer relevant),
  "reasoning": "korte uitleg waarom wel/niet relevant",
  "suggested_category": "IT Support, Cybersecurity, Cloud, Microsoft 365, Networking, Trends, Nieuws, of null als niet relevant",
  "business_value": "waarom interessant voor Workflo's doelgroep (of null)"
}

Antwoord ALLEEN met valid JSON.`;

  return {
    json: {
      ...rss,
      relevance_prompt: relevancePrompt,
      original_title: title,
      original_content: content,
      content_excerpt: excerpt,
      source_url: source
    }
  };
});
```

---

### **Node 3: OpenAI Relevance Check** (HTTP Request Node)

**Voor OpenAI (GPT-4o-mini - snel en goedkoop):**

- **Method**: POST
- **URL**: `https://api.openai.com/v1/chat/completions`
- **Authentication**: Header Auth
  - **Name**: `Authorization`
  - **Value**: `Bearer {{ $env.OPENAI_API_KEY }}`
- **Body** (JSON):

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "Je bent een content filter voor Workflo, een IT services bedrijf. Beoordeel of nieuwsartikelen relevant zijn voor hun blog over IT, cybersecurity, cloud en business technology."
    },
    {
      "role": "user",
      "content": "={{ $json.relevance_prompt }}"
    }
  ],
  "temperature": 0.2,
  "response_format": { "type": "json_object" }
}
```

**Voor Claude Haiku (nog sneller):**

- **Method**: POST
- **URL**: `https://api.anthropic.com/v1/messages`
- **Headers**:
  - `x-api-key`: `{{ $env.ANTHROPIC_API_KEY }}`
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`
- **Body** (JSON):

```json
{
  "model": "claude-3-haiku-20240307",
  "max_tokens": 512,
  "messages": [
    {
      "role": "user",
      "content": "={{ $json.relevance_prompt }}"
    }
  ]
}
```

---

### **Node 4: Parse Relevance Response** (Code Node)

```javascript
// Parse AI relevance response
const items = $input.all();

return items.map(item => {
  let relevanceData;

  try {
    // For OpenAI
    if (item.json.choices) {
      const content = item.json.choices[0].message.content;
      relevanceData = JSON.parse(content);
    }
    // For Claude
    else if (item.json.content) {
      const content = item.json.content[0].text;
      relevanceData = JSON.parse(content);
    }
    else {
      throw new Error('Unknown AI response format');
    }
  } catch (error) {
    console.error('Failed to parse relevance check:', error);
    // Default to not relevant if parsing fails
    relevanceData = {
      is_relevant: false,
      relevance_score: 0,
      reasoning: 'Failed to parse AI response',
      suggested_category: null,
      business_value: null
    };
  }

  return {
    json: {
      ...item.json,
      relevance: relevanceData,
      is_relevant: relevanceData.is_relevant,
      relevance_score: relevanceData.relevance_score || 0
    }
  };
});
```

---

### **Node 5: Filter - Only Relevant Articles** (Filter Node / IF Node)

**Option A: Using Filter Node**
- **Conditions**:
  - `{{ $json.is_relevant }}` equals `true`
  - AND `{{ $json.relevance_score }}` is greater than or equal to `60`

**Option B: Using IF Node**
- **Condition**: `{{ $json.is_relevant === true && $json.relevance_score >= 60 }}`
- **Route**: Only process TRUE branch

**Option C: Code Node Filter**

```javascript
// Filter only relevant articles
const items = $input.all();

// Only return items that are relevant (score >= 60)
const relevantItems = items.filter(item => {
  const relevance = item.json.relevance || {};
  return relevance.is_relevant === true && (relevance.relevance_score || 0) >= 60;
});

console.log(`Filtered: ${relevantItems.length} relevant out of ${items.length} total articles`);

return relevantItems;
```

---

### **Node 6: Prepare Metadata Prompt** (Code Node)

```javascript
// Prepare detailed metadata generation for RELEVANT articles only
const items = $input.all();

return items.map(item => {
  const rss = item.json;
  const relevance = item.json.relevance || {};

  // Use AI's suggested category as hint
  const suggestedCat = relevance.suggested_category || 'Nieuws';

  const metadataPrompt = `Genereer uitgebreide metadata voor dit IT-gerelateerde artikel.

ARTIKEL TITEL: ${rss.original_title}

ARTIKEL CONTENT:
${rss.original_content || rss.content_excerpt}

AI ANALYSE:
- Voorgestelde categorie: ${suggestedCat}
- Relevantie score: ${relevance.relevance_score}/100
- Business waarde: ${relevance.business_value}

Geef een JSON response met:
{
  "category": "hoofdcategorie uit: IT Support, Cybersecurity, Cloud Solutions, Microsoft 365, Networking, Hardware, Software, AI & Automation, Trends, Tips & Tricks, Nieuws, Case Study",
  "tags": ["4-6 specifieke Nederlandse tags, focus op technische termen"],
  "excerpt": "pakkende samenvatting (140-160 karakters) die de waarde voor bedrijven benadrukt",
  "meta_description": "SEO meta description (150-160 karakters) met focus keyword",
  "target_audience": "specifieke doelgroep (bijv: 'MKB ondernemers met 10-50 medewerkers', 'IT managers in de financiële sector', 'zzp'ers die remote werken')",
  "difficulty_level": "beginner, intermediate, of advanced",
  "reading_time": geschatte leestijd in minuten (integer),
  "keywords": ["5-8 SEO keywords, mix van short-tail en long-tail"],
  "focus_keyword": "primaire SEO keyword (2-4 woorden)",
  "call_to_action": "concrete CTA relevant voor het onderwerp",
  "related_services": ["Workflo diensten die aansluiten: Managed IT, Cybersecurity Audit, Cloud Migratie, Microsoft 365 Setup, Backup & Recovery, VoIP Telefonie, Hardware as a Service"],
  "urgency_level": "low, medium, high (hoe urgent/actueel is dit voor bedrijven)",
  "workflo_angle": "hoe Workflo kan helpen met dit onderwerp (1 zin)"
}

Antwoord ALLEEN met valid JSON.`;

  return {
    json: {
      ...rss,
      metadata_prompt: metadataPrompt
    }
  };
});
```

---

### **Node 7: OpenAI Metadata Generation** (HTTP Request Node)

Zelfde setup als Node 3, maar gebruik nu `{{ $json.metadata_prompt }}`

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "Je bent een SEO en content specialist voor Workflo. Genereer professionele metadata die de business waarde voor IT managers en ondernemers benadrukt."
    },
    {
      "role": "user",
      "content": "={{ $json.metadata_prompt }}"
    }
  ],
  "temperature": 0.3,
  "response_format": { "type": "json_object" }
}
```

---

### **Node 8: Extract & Merge Metadata** (Code Node)

```javascript
// Extract metadata and merge with original data
const items = $input.all();

return items.map(item => {
  let metadata;

  try {
    // Parse AI response
    if (item.json.choices) {
      metadata = JSON.parse(item.json.choices[0].message.content);
    } else if (item.json.content) {
      metadata = JSON.parse(item.json.content[0].text);
    }
  } catch (error) {
    console.error('Failed to parse metadata:', error);
    // Fallback metadata
    metadata = {
      category: item.json.relevance?.suggested_category || 'Nieuws',
      tags: ['IT', 'technologie'],
      excerpt: item.json.content_excerpt?.substring(0, 160) || '',
      reading_time: 5
    };
  }

  return {
    json: {
      ...item.json,
      ai_metadata: metadata
    }
  };
});
```

---

### **Node 9: Transform to Supabase** (Code Node)

```javascript
// Final transformation for Supabase
const items = $input.all();

const DEFAULT_AUTHOR_ID = 'b07398bf-9ad4-4a44-8d54-66d6974a6f20';

return items.map(item => {
  const rss = item.json;
  const ai = item.json.ai_metadata || {};
  const relevance = item.json.relevance || {};

  // Clean slug
  const slug = (rss.original_title || 'untitled')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);

  // Merge tags
  const allTags = [
    ...(ai.tags || []),
    ...(Array.isArray(rss.categories) ? rss.categories : [])
  ];
  const uniqueTags = [...new Set(allTags)].slice(0, 10);

  // Use AI or fallback
  const excerpt = ai.excerpt ||
                  (rss.description || rss.original_content || '').substring(0, 160);

  const readingTime = ai.reading_time ||
                      Math.max(1, Math.ceil((rss.original_content?.split(' ').length || 200) / 200));

  return {
    json: {
      // Required fields
      title: rss.original_title || 'Untitled',
      slug: slug,
      content: rss.original_content || '',
      author_id: DEFAULT_AUTHOR_ID,

      // AI-enhanced fields
      excerpt: excerpt,
      tags: uniqueTags,

      // Media & Publishing
      featured_image: rss.image || rss.enclosure?.url || null,
      published_at: rss.pubDate || new Date().toISOString(),
      status: 'published',

      // Calculated fields
      read_time_minutes: readingTime,
      view_count: 0,

      // SEO (if schema supports)
      meta_description: ai.meta_description || excerpt,
      keywords: ai.keywords || [],
      focus_keyword: ai.focus_keyword || null,

      // Extended metadata (JSONB column)
      metadata: {
        // Source tracking
        source: 'freshrss',
        source_url: rss.source_url || rss.link,

        // AI processing info
        ai_processed: true,
        processed_at: new Date().toISOString(),

        // Relevance data
        relevance_score: relevance.relevance_score,
        relevance_reasoning: relevance.reasoning,

        // Content classification
        ai_category: ai.category,
        target_audience: ai.target_audience,
        difficulty_level: ai.difficulty_level,
        urgency_level: ai.urgency_level,

        // Business value
        call_to_action: ai.call_to_action,
        related_services: ai.related_services,
        workflo_angle: ai.workflo_angle,
        business_value: relevance.business_value,

        // Original RSS data
        original_categories: rss.categories || []
      }
    }
  };
});
```

---

### **Node 10: Insert into Supabase**

- **Table**: `blog_posts`
- **Columns**: **Auto-map Input Data to Columns**

---

## 📊 VOORBEELD AI FILTERING

### ✅ **RELEVANT ARTIKEL** (wordt gepubliceerd):

**Titel**: "Microsoft waarschuwt voor nieuwe phishing-campagne gericht op MKB"

```json
{
  "is_relevant": true,
  "relevance_score": 95,
  "reasoning": "Direct relevant: cybersecurity threat die MKB bedrijven treft, Microsoft technologie, phishing prevention valt onder Workflo's expertise",
  "suggested_category": "Cybersecurity",
  "business_value": "Workflo kan klanten waarschuwen en beschermen tegen deze threat"
}
```

✅ **DOORGESTUURD NAAR METADATA GENERATIE**

---

### ❌ **NIET RELEVANT ARTIKEL** (wordt geskipt):

**Titel**: "Ajax verslaat Feyenoord met 3-1 in spannende wedstrijd"

```json
{
  "is_relevant": false,
  "relevance_score": 0,
  "reasoning": "Sport nieuws zonder IT component, geen zakelijke IT waarde voor Workflo's doelgroep",
  "suggested_category": null,
  "business_value": null
}
```

❌ **GESTOPT NA FILTER NODE**

---

### 🟡 **GRENSGEVALLEN** (score 50-70):

**Titel**: "Nederland krijgt snelste internet van Europa"

```json
{
  "is_relevant": true,
  "relevance_score": 65,
  "reasoning": "Networking nieuws relevant voor IT bedrijven, maar algemeen consument-gericht. Beperkte business angle.",
  "suggested_category": "Networking",
  "business_value": "Kan gekoppeld worden aan Workflo's bedrijfsnetwerk diensten"
}
```

⚠️ **OP DE GRENS** - Pas drempelwaarde aan (60-70) naar wens

---

## 🎯 FILTER DREMPELWAARDEN

Pas aan in Node 5 (Filter):

```javascript
// Streng (alleen top content):
relevance_score >= 80

// Normaal (goede balans):
relevance_score >= 60

// Ruim (meer content):
relevance_score >= 40
```

---

## 💰 KOSTEN UPDATE

**Met filtering:**
- **Relevance check**: ~500 tokens = $0.0001 per artikel
- **Metadata generation**: ~1000 tokens = $0.0002 per artikel (alleen voor relevant)
- **Totaal per relevant artikel**: ~$0.0003 (€0.0003)

**Voorbeeld scenario:**
- 100 artikelen van NU.nl/NOS.nl per dag
- 15% is relevant (15 artikelen)
- **Cost**: 100 × $0.0001 + 15 × $0.0002 = **$0.013 per dag**
- **Per maand**: ~€0.40

**VOORDEEL**: Je bespaart op opslagruimte en hebt alleen kwalitatieve content! 🎉

---

## 🧪 TESTING CHECKLIST

1. ✅ Test met duidelijk RELEVANT artikel (cybersecurity, cloud)
2. ✅ Test met duidelijk NIET-RELEVANT artikel (sport, weer)
3. ✅ Test met grensgevallen (algemene tech nieuws)
4. ✅ Pas drempelwaarde aan naar jouw voorkeur
5. ✅ Monitor eerste 50 artikelen en tune prompt indien nodig

---

## 📈 MONITORING

Voeg een "Log" node toe na de Filter node:

```javascript
// Log filtering statistics
const items = $input.all();

const stats = {
  total_processed: items.length,
  avg_relevance_score: items.reduce((sum, item) => sum + (item.json.relevance_score || 0), 0) / items.length,
  categories: items.reduce((acc, item) => {
    const cat = item.json.relevance?.suggested_category || 'Unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {})
};

console.log('Filtering stats:', JSON.stringify(stats, null, 2));

return items;
```

---

## 🚀 COMPLETE WORKFLOW SUMMARY

```
1. FreshRSS (NU.nl, NOS.nl, tech feeds)
   ↓
2. Prepare Relevance Prompt (extract content)
   ↓
3. AI Relevance Check (OpenAI/Claude)
   ↓
4. Parse Response (extract relevance data)
   ↓
5. ❌ FILTER (skip if relevance_score < 60)
   ↓
6. ✅ Prepare Metadata Prompt (only relevant)
   ↓
7. AI Metadata Generation (detailed analysis)
   ↓
8. Extract & Merge Metadata
   ↓
9. Transform to Supabase format
   ↓
10. Insert into Supabase
```

**Result**: Alleen relevante, kwalitatieve IT/tech content op je blog! 🎉

---

## 💡 TIPS

1. **Tune de prompts** na eerste 20-30 artikelen
2. **Lagere temperature** (0.1-0.3) = consistenter filtering
3. **Hogere relevance_score drempel** = strengere filtering
4. **Monitor rejected articles** eerste week om te zien of filtering correct is
5. **Pas categorieën aan** in prompt naar jouw Supabase schema

Succes met je AI-powered content filtering! 🚀
