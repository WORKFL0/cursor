# 🤖 Automatisch N8N Workflow Aanmaken

**Doel**: Met één commando de complete AI-powered FreshRSS workflow aanmaken in N8N.

---

## ✅ WAT HET SCRIPT DOET

Het script maakt automatisch een complete N8N workflow aan met:

1. ✅ **FreshRSS data ophalen**
2. ✅ **AI Relevantie Check** (filtert NU.nl/NOS.nl sport/entertainment)
3. ✅ **Filter Node** (alleen relevante artikelen)
4. ✅ **AI Metadata Generatie** (tags, categories, SEO, etc.)
5. ✅ **Transform naar Supabase formaat**
6. ✅ **Insert in blog_posts table**

**Alles voorge configureerd** met jouw:
- ✅ N8N API key
- ✅ OpenAI API key
- ✅ Supabase credentials
- ✅ Author UUID

---

## 🚀 GEBRUIK

### **Stap 1: Wat heb je nodig?**

- ✅ N8N instance URL (bijv: `https://n8n.workflo.it`)
- ✅ N8N credentials moeten al bestaan:
  - **FreshRSS credentials** (HTTP Basic Auth)
  - **Supabase credentials** (URL + Service Role Key)

### **Stap 2: Update N8N URL**

Open het script en pas de URL aan als nodig:

```typescript
// In scripts/create-n8n-workflow.ts regel 8:
const N8N_URL = 'https://n8n.workflo.it' // ← Pas dit aan naar jouw N8N URL
```

### **Stap 3: Run het script**

```bash
cd new-project

# Met npx tsx:
npx tsx scripts/create-n8n-workflow.ts

# Of met ts-node:
ts-node scripts/create-n8n-workflow.ts
```

### **Stap 4: Resultaat**

Je krijgt output zoals:

```
🚀 Creating N8N workflow...
✅ Workflow created successfully!
📋 Workflow ID: abc123-def456-ghi789
🔗 URL: https://n8n.workflo.it/workflow/abc123-def456-ghi789
```

---

## 🔧 CREDENTIALS SETUP IN N8N

Na het aanmaken moet je **eenmalig** credentials configureren in N8N:

### **1. FreshRSS Credentials**

Go to: **Settings → Credentials → Add Credential → HTTP Basic Auth**

- **Name**: `FreshRSS API`
- **User**: Je FreshRSS username
- **Password**: Je FreshRSS password

**Test URL**: `https://rss.workflo.nlit/api/greader.php/reader/api/0/stream/contents`

---

### **2. Supabase Credentials**

Go to: **Settings → Credentials → Add Credential → Supabase**

- **Name**: `Workflo Supabase`
- **Host**: `mzmeylvtdvqrbutlbkfu.supabase.co`
- **Service Role Secret**: `{{ $env.SUPABASE_service_role }}`

Of hardcode (uit je `.env.local`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bWV5bHZ0ZHZxcmJ1dGxia2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI4MjU2OSwiZXhwIjoyMDcxODU4NTY5fQ.Ag3YBn9NHtppC1j00OEc-VbNrsDmq5PFhoDdEzGn1CM
```

---

## 📋 WORKFLOW OVERZICHT

De aangemaakte workflow heeft **10 nodes**:

```
1. Manual Trigger          → Start workflow handmatig (voor testen)
2. Fetch FreshRSS          → Haalt RSS feed op
3. Prepare Relevance Check → Maakt AI prompt voor filtering
4. AI Relevance Check      → OpenAI beoordeelt relevantie
5. Parse Relevance         → Extract relevance score
6. Filter Relevant Only    → Skipped niet-relevante artikelen (IF node)
7. Prepare Metadata Prompt → Maakt AI prompt voor metadata
8. Generate Metadata       → OpenAI genereert tags, SEO, etc.
9. Transform to Supabase   → Formatteert voor database
10. Insert into Supabase   → Slaat op in blog_posts table
```

---

## 🧪 TESTEN

### **Test 1: Handmatig uitvoeren**

1. Open workflow in N8N: `https://n8n.workflo.it/workflow/[ID]`
2. Klik **"Execute Workflow"**
3. Bekijk output van elke node
4. Check Supabase: `SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5;`

### **Test 2: Met 1 RSS item**

Voeg een "Limit" parameter toe aan de FreshRSS fetch:
- URL: `.../stream/contents?n=1` (haalt 1 item op)

### **Test 3: Relevante vs Niet-relevante artikelen**

Test met:
- ✅ **Relevant**: Tech nieuws, cybersecurity, cloud
- ❌ **Niet-relevant**: Sport, entertainment, weer

Check of filter correct werkt!

---

## ⚙️ CONFIGURATIE OPTIES

### **Filter Drempelwaarde Aanpassen**

In **Node 6 (Filter Relevant Only)**:

```javascript
// Huidige instelling: minimaal score 60
value2: 60

// Strenger (alleen top content):
value2: 80

// Ruimer (meer content):
value2: 40
```

### **AI Model Wijzigen**

In **Nodes 4 & 8 (OpenAI requests)**:

```javascript
// Sneller & goedkoper (huidige):
"model": "gpt-4o-mini"

// Betere kwaliteit (duurder):
"model": "gpt-4o"

// Claude gebruiken (wijzig hele node):
URL: https://api.anthropic.com/v1/messages
Model: claude-3-haiku-20240307
```

### **Automatische Trigger Toevoegen**

Vervang **Node 1 (Manual Trigger)** door:

**Option A: Schedule Trigger**
- Trigger type: Schedule Trigger
- Interval: Elke 1 uur / 6 uur / dagelijks

**Option B: Webhook Trigger**
- Trigger type: Webhook
- URL: krijg je van N8N
- Call vanuit FreshRSS of externe cron

---

## 🔄 WORKFLOW UPDATEN

Als je wijzigingen maakt in het script:

```bash
# Haal oude workflow ID op
curl -X GET https://n8n.workflo.nl/api/v1/workflows \
  -H "X-N8N-API-KEY: $N8N_API_KEY"

# Update bestaande workflow
curl -X PUT https://n8n.workflo.nl/api/v1/workflows/[WORKFLOW_ID] \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflow.json
```

Of maak het script **idempotent** door eerst te checken of workflow bestaat.

---

## 💰 KOSTEN INDICATIE

**Per run met 100 artikelen:**
- Relevance checks: 100 × $0.0001 = $0.01
- Metadata generation: 15 × $0.0002 = $0.003 (15% relevant)
- **Totaal**: ~$0.013 (~€0.01 per run)

**Dagelijks**: 1× per dag = €0.30/maand
**Per uur**: 24× per dag = €7/maand

---

## 🆘 TROUBLESHOOTING

### Error: "Connection refused"
**Check**: Is N8N URL correct? Is N8N bereikbaar?
```bash
curl https://n8n.workflo.it/healthz
```

### Error: "Unauthorized / API key invalid"
**Check**: Is N8N_API_KEY correct in `.env.local`?

### Error: "Credential not found"
**Fix**: Maak credentials handmatig aan in N8N (zie boven)

### Workflow werkt maar geeft geen data
**Check**:
1. FreshRSS credentials correct?
2. Test FreshRSS URL rechtstreeks in browser
3. Bekijk N8N execution logs

### AI response is geen valid JSON
**Fix**:
- Verlaag temperature (0.1-0.3)
- Voeg meer "ONLY JSON" instructies toe aan prompt
- Check OpenAI API key

---

## 📊 MONITORING

### **Check workflow executions**

```bash
# Via N8N API
curl https://n8n.workflo.it/api/v1/executions?workflowId=[ID] \
  -H "X-N8N-API-KEY: $N8N_API_KEY"
```

### **Check filtering stats**

Voeg logging node toe na Filter:

```javascript
const passed = $input.all().length;
console.log(`✅ ${passed} articles passed filter`);
```

### **Check Supabase inserts**

```sql
-- Artikelen vandaag
SELECT COUNT(*) FROM blog_posts
WHERE created_at > CURRENT_DATE;

-- Meest recente
SELECT title, created_at, metadata->'relevance_score' as score
FROM blog_posts
ORDER BY created_at DESC
LIMIT 10;

-- AI processing stats
SELECT
  metadata->>'ai_category' as category,
  COUNT(*) as count
FROM blog_posts
WHERE metadata->>'ai_processed' = 'true'
GROUP BY category
ORDER BY count DESC;
```

---

## 🎯 SUCCESS CRITERIA

✅ **Workflow aangemaakt** in N8N
✅ **Credentials geconfigureerd**
✅ **Test uitvoering succesvol**
✅ **Relevantie filtering werkt** (sport/entertainment gefilterd)
✅ **Metadata wordt gegenereerd** (tags, categories, SEO)
✅ **Data verschijnt in Supabase** (blog_posts table)

---

## 📞 SUMMARY

**Wat je nu kunt doen:**

```bash
# 1. Run het script
cd new-project
npx tsx scripts/create-n8n-workflow.ts

# 2. Open workflow in N8N
# URL wordt geprint in console

# 3. Configureer credentials (eenmalig)
# FreshRSS + Supabase in N8N settings

# 4. Test workflow
# Klik "Execute Workflow" in N8N

# 5. Check results
# SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5;
```

**Je workflow is nu volledig geautomatiseerd!** 🎉

Alleen relevante, AI-verrijkte IT content wordt automatisch naar je blog gepusht!
