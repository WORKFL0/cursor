# 🤖 N8N AI-Powered Blog Content Workflow

**Doel**: Automatisch FreshRSS artikelen verrijken met AI-gegenereerde metadata en categoriseren voor Supabase.

---

## 🎯 WORKFLOW OVERZICHT

```
FreshRSS
    ↓
1. Extract Raw Data
    ↓
2. Prepare AI Prompt
    ↓
3. AI Analysis (OpenAI/Claude)
    ↓
4. Merge AI Output
    ↓
5. Transform to Supabase Format
    ↓
6. Insert into Supabase
```

---

## 📋 COMPLETE N8N WORKFLOW

### **Node 1: FreshRSS Trigger/Fetch**
(Je hebt deze al)

---

### **Node 2: Prepare AI Prompt** (Code Node)

```javascript
// Prepare content for AI analysis
const items = $input.all();

return items.map(item => {
  const rss = item.json;

  // Extract relevant content
  const title = rss.title || 'No title';
  const content = rss.content || rss.description || '';
  const excerpt = content.substring(0, 500); // First 500 chars for AI

  // Create prompt for AI
  const aiPrompt = `Analyseer dit blog artikel en genereer metadata in JSON formaat.

ARTIKEL TITEL: ${title}

ARTIKEL CONTENT (excerpt):
${excerpt}

Geef een JSON response met:
{
  "category": "een hoofdcategorie (IT Support, Cybersecurity, Cloud Solutions, Microsoft 365, Networking, Hardware, Software, Trends, Tips & Tricks, Nieuws, of Case Study)",
  "tags": ["3-5 relevante tags in het Nederlands"],
  "excerpt": "een pakkende samenvatting van 140-160 karakters",
  "meta_description": "SEO-vriendelijke meta description (150-160 karakters)",
  "target_audience": "doelgroep (bijv: kleine bedrijven, enterprise, IT managers, developers)",
  "difficulty_level": "beginner, intermediate, of advanced",
  "reading_time": geschatte leestijd in minuten (integer),
  "keywords": ["5-7 SEO keywords"],
  "call_to_action": "suggestie voor CTA (bijv: Neem contact op, Vraag advies aan, Lees meer over)",
  "related_services": ["lijst met relevante Workflo diensten"]
}

Antwoord ALLEEN met valid JSON, geen extra tekst.`;

  return {
    json: {
      ...rss,
      ai_prompt: aiPrompt,
      original_title: title,
      original_content: content,
      content_excerpt: excerpt
    }
  };
});
```

---

### **Node 3: OpenAI/Claude Analysis** (HTTP Request Node)

**Voor OpenAI (ChatGPT):**

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
      "content": "Je bent een SEO en content specialist voor Workflo, een IT services bedrijf in Amsterdam. Analyseer blog content en genereer accurate metadata in het Nederlands."
    },
    {
      "role": "user",
      "content": "={{ $json.ai_prompt }}"
    }
  ],
  "temperature": 0.3,
  "response_format": { "type": "json_object" }
}
```

**Voor Anthropic (Claude):**

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
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "={{ $json.ai_prompt }}"
    }
  ]
}
```

---

### **Node 4: Extract AI Response** (Code Node)

```javascript
// Extract and parse AI response
const items = $input.all();

return items.map(item => {
  let aiMetadata;

  try {
    // For OpenAI
    if (item.json.choices) {
      const content = item.json.choices[0].message.content;
      aiMetadata = JSON.parse(content);
    }
    // For Claude
    else if (item.json.content) {
      const content = item.json.content[0].text;
      aiMetadata = JSON.parse(content);
    }
    else {
      throw new Error('Unknown AI response format');
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    // Fallback metadata
    aiMetadata = {
      category: 'Nieuws',
      tags: ['IT', 'technologie'],
      excerpt: item.json.content_excerpt?.substring(0, 160) || '',
      meta_description: item.json.content_excerpt?.substring(0, 160) || '',
      target_audience: 'algemeen',
      difficulty_level: 'intermediate',
      reading_time: 5,
      keywords: [],
      call_to_action: 'Neem contact op',
      related_services: []
    };
  }

  return {
    json: {
      ...item.json,
      ai_metadata: aiMetadata
    }
  };
});
```

---

### **Node 5: Transform to Supabase Format** (Code Node)

```javascript
// Final transformation for Supabase
const items = $input.all();

// Your author UUID
const DEFAULT_AUTHOR_ID = 'b07398bf-9ad4-4a44-8d54-66d6974a6f20';

return items.map(item => {
  const rss = item.json;
  const ai = item.json.ai_metadata || {};

  // Clean slug
  const slug = (rss.original_title || 'untitled')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100); // Max 100 chars

  // Merge tags: AI tags + RSS categories
  const allTags = [
    ...(ai.tags || []),
    ...(Array.isArray(rss.categories) ? rss.categories : [])
  ];
  const uniqueTags = [...new Set(allTags)].slice(0, 10); // Max 10 unique tags

  // Use AI excerpt or generate from content
  const excerpt = ai.excerpt ||
                  (rss.description || rss.original_content || '').substring(0, 160);

  // Use AI reading time or calculate
  const readingTime = ai.reading_time ||
                      Math.max(1, Math.ceil((rss.original_content?.split(' ').length || 200) / 200));

  return {
    json: {
      // Required Supabase fields
      title: rss.original_title || 'Untitled',
      slug: slug,
      content: rss.original_content || '',
      author_id: DEFAULT_AUTHOR_ID,

      // AI-enhanced fields
      excerpt: excerpt,
      category_id: null, // You'll need to map category names to IDs (see below)
      tags: uniqueTags,

      // Metadata
      featured_image: rss.image || rss.enclosure?.url || null,
      published_at: rss.pubDate || new Date().toISOString(),
      status: 'published',

      // Calculated fields
      read_time_minutes: readingTime,
      view_count: 0,

      // SEO fields (if your schema has these)
      meta_description: ai.meta_description || excerpt,
      keywords: ai.keywords || [],

      // Additional metadata (store in JSONB metadata column)
      metadata: {
        source: 'freshrss',
        ai_category: ai.category,
        target_audience: ai.target_audience,
        difficulty_level: ai.difficulty_level,
        call_to_action: ai.call_to_action,
        related_services: ai.related_services,
        original_url: rss.link,
        ai_processed: true,
        processed_at: new Date().toISOString()
      }
    }
  };
});
```

---

### **Node 6: Supabase Insert**

- **Table**: `blog_posts`
- **Columns**: **Auto-map Input Data to Columns**

---

## 🎨 OPTIONEEL: Category Mapping Node

Als je categorieën hebt in Supabase, voeg deze node toe tussen Node 5 en Node 6:

```javascript
// Map AI category to Supabase category_id
const items = $input.all();

// Category mapping (update with your actual category IDs from Supabase)
const categoryMap = {
  'IT Support': 'uuid-voor-it-support',
  'Cybersecurity': 'uuid-voor-cybersecurity',
  'Cloud Solutions': 'uuid-voor-cloud',
  'Microsoft 365': 'uuid-voor-m365',
  'Networking': 'uuid-voor-networking',
  'Hardware': 'uuid-voor-hardware',
  'Software': 'uuid-voor-software',
  'Trends': 'uuid-voor-trends',
  'Tips & Tricks': 'uuid-voor-tips',
  'Nieuws': 'uuid-voor-nieuws',
  'Case Study': 'uuid-voor-cases'
};

return items.map(item => {
  const aiCategory = item.json.metadata?.ai_category || 'Nieuws';
  const categoryId = categoryMap[aiCategory] || null;

  return {
    json: {
      ...item.json,
      category_id: categoryId
    }
  };
});
```

---

## 🔑 ENVIRONMENT VARIABLES

Voeg toe aan je N8N environment:

```bash
OPENAI_API_KEY=sk-proj-placeholder-key-for-documentation

# Of voor Claude:
ANTHROPIC_API_KEY=sk-ant-api03-placeholder-key-for-documentation
```

---

## 💰 KOSTEN INDICATIE

### OpenAI GPT-4o-mini:
- **Input**: $0.150 / 1M tokens
- **Output**: $0.600 / 1M tokens
- **Per artikel**: ~$0.001-0.002 (minder dan 1 cent per artikel!)

### Anthropic Claude Haiku:
- **Input**: $0.25 / 1M tokens
- **Output**: $1.25 / 1M tokens
- **Per artikel**: ~$0.001-0.003

**Voor 100 artikelen per maand**: €0.10-0.30 🎉

---

## 📊 WAT DE AI GENEREERT

Voor elk artikel krijg je:

```json
{
  "category": "Cybersecurity",
  "tags": ["GDPR", "AVG", "compliance", "beveiliging", "privacy"],
  "excerpt": "Ontdek de belangrijkste GDPR compliance vereisten voor Nederlandse bedrijven in 2025 en hoe je boetes voorkomt.",
  "meta_description": "Complete GDPR compliance gids voor bedrijven: vereisten, boetes en praktische tips om AVG-proof te blijven in 2025.",
  "target_audience": "kleine en middelgrote bedrijven",
  "difficulty_level": "intermediate",
  "reading_time": 8,
  "keywords": ["GDPR compliance", "AVG Nederland", "privacy wetgeving", "databeveiliging", "GDPR boetes"],
  "call_to_action": "Vraag een gratis GDPR scan aan",
  "related_services": ["Cybersecurity audit", "Compliance consulting", "ISO 27001 certificering"]
}
```

---

## 🧪 TESTING

### Test met 1 artikel:

1. Voer workflow uit met **1 RSS item** eerst
2. Check de output van elke node
3. Verifieer dat AI response valid JSON is
4. Check Supabase insert

### Debugging:

Als AI geen JSON geeft:
- Check temperature (lager = consistenter)
- Gebruik `response_format: json_object` bij OpenAI
- Voeg "Output ONLY JSON" toe aan prompt

---

## 🎯 VOORDELEN VAN DEZE WORKFLOW

✅ **Automatische categorisatie** - AI herkent onderwerp
✅ **SEO-optimalisatie** - Keywords, meta descriptions
✅ **Consistente tags** - AI gebruikt relevante Nederlandse tags
✅ **Doelgroep targeting** - Weet voor wie artikel is
✅ **Betere CTAs** - AI suggereert relevante call-to-actions
✅ **Service linking** - Verbindt artikelen met je diensten
✅ **Kwaliteitscontrole** - Difficulty level helpt bij content planning

---

## 🚀 DEPLOYMENT

1. Sla workflow op in N8N
2. Test met 1 artikel
3. Als het werkt, activeer automatische trigger
4. Monitor de eerste 10 artikelen
5. Pas AI prompt aan indien nodig voor betere resultaten

---

## 📞 SUMMARY

Je workflow wordt nu:

```
FreshRSS
  → Prepare AI Prompt (extract content)
  → OpenAI/Claude (analyze & categorize)
  → Extract AI Response (parse JSON)
  → Transform to Supabase (merge AI + RSS data)
  → Insert into Supabase
```

**Cost**: ~€0.001 per artikel
**Time**: ~3-5 seconden per artikel
**Quality**: Professionele, SEO-geoptimaliseerde content metadata

Succes! 🎉
