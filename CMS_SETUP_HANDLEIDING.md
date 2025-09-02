# 📚 Complete CMS Setup Handleiding voor Workflo

## 🎯 Overzicht
Deze handleiding helpt je stap voor stap om een volledig werkend CMS systeem op te zetten met Supabase als database. Na het volgen van deze stappen heb je:
- ✅ Een werkende database met alle nieuws/artikelen
- ✅ Een beveiligd CMS dashboard voor content beheer
- ✅ Automatische publicatie naar de website
- ✅ Gebruikersbeheer met rollen (Admin, Editor, Viewer)

---

## 📋 Stap 1: Supabase Account Aanmaken (5 minuten)

### 1.1 Maak een gratis Supabase account
1. Ga naar https://supabase.com
2. Klik op "Start your project"
3. Log in met GitHub (aanbevolen) of maak een account met email
4. Je krijgt 2 gratis projecten met 500MB database ruimte

### 1.2 Maak een nieuw project
1. Klik op "New Project"
2. Vul in:
   - **Project name**: `workflo-cms`
   - **Database Password**: Genereer een sterk wachtwoord (BEWAAR DIT!)
   - **Region**: `West EU (Ireland)` (voor beste performance in Nederland)
3. Klik op "Create new project"
4. Wacht 2-3 minuten tot het project klaar is

### 1.3 Verzamel je credentials
Ga naar Settings → API en kopieer:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon/Public key**: `eyJhbGc...` (lang)
- **Service role key**: `eyJhbGc...` (lang - GEHEIM HOUDEN!)

---

## 📋 Stap 2: Environment Variables Instellen (2 minuten)

### 2.1 Open je `.env.local` bestand
```bash
# In je terminal
cd /Users/florian/Library/CloudStorage/OneDrive-WorkfloB.V/Documenten/code/Cursor/new-project
```

### 2.2 Voeg deze regels toe aan `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...je-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...je-service-role-key

# JWT Secret voor authenticatie (genereer met: openssl rand -base64 32)
JWT_SECRET=je-gegenereerde-jwt-secret-minimaal-32-karakters

# Optional: API Key voor externe toegang
API_KEY=een-veilige-api-key-voor-n8n
```

### 2.3 Genereer een JWT Secret:
```bash
openssl rand -base64 32
```
Kopieer de output en plak in JWT_SECRET

---

## 📋 Stap 3: Database Setup (5 minuten)

### 3.1 Open Supabase SQL Editor
1. Ga naar je Supabase project dashboard
2. Klik op "SQL Editor" in het linker menu
3. Klik op "+ New query"

### 3.2 Kopieer en run de database migration
Kopieer de COMPLETE inhoud van dit bestand:
`/supabase/migrations/001_initial_cms_schema.sql`

Plak in de SQL editor en klik op "Run"

✅ Je zou moeten zien: "Success. No rows returned"

### 3.3 Controleer de tabellen
1. Ga naar "Table Editor" in Supabase
2. Je zou deze tabellen moeten zien:
   - articles
   - users
   - tags
   - categories
   - media
   - article_tags
   - comments
   - analytics
   - sessions
   - audit_logs
   - settings

---

## 📋 Stap 4: Installeer Dependencies & Setup (3 minuten)

### 4.1 Stop de huidige server
Druk `Ctrl+C` in de terminal waar de server draait

### 4.2 Installeer packages
```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 4.3 Run de automatische setup
```bash
npm run cms:setup
```

Dit script doet automatisch:
- ✅ Maakt een admin gebruiker aan
- ✅ Voegt sample artikelen toe
- ✅ Configureert de juiste permissies
- ✅ Test de database connectie

Als alles goed gaat zie je:
```
✅ CMS Setup completed successfully!
Admin login: admin@workflo.it / Admin123!
```

---

## 📋 Stap 5: Start de Server & Test (2 minuten)

### 5.1 Start de development server
```bash
npm run dev
```

### 5.2 Test het CMS
1. Open: http://localhost:3000/cms/login
2. Login met:
   - Email: `admin@workflo.it`
   - Password: `Admin123!`

### 5.3 Test artikel aanmaken
1. Klik op "New Article"
2. Vul in:
   - Title: "Test Artikel"
   - Content: "Dit is een test"
   - Tags: "test, cms"
3. Klik op "Publish"

### 5.4 Bekijk op de website
Open: http://localhost:3000/nieuws
Je nieuwe artikel staat er direct!

---

## 🔧 Troubleshooting

### ❌ Error: "Invalid API key"
**Oplossing**: Check of je Supabase keys correct zijn gekopieerd in `.env.local`

### ❌ Error: "relation 'articles' does not exist"
**Oplossing**: De database migration is niet uitgevoerd. Ga terug naar Stap 3.2

### ❌ Error: "Authentication failed"
**Oplossing**: 
1. Check of JWT_SECRET is ingesteld
2. Run opnieuw: `npm run cms:setup`

### ❌ Server start niet
**Oplossing**:
```bash
# Clear cache en reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### ❌ Geen artikelen zichtbaar op /nieuws
**Oplossing**: 
1. Check Supabase Table Editor of er data in 'articles' staat
2. Check browser console voor errors
3. Verifieer dat status = 'published' voor artikelen

---

## ✅ Verificatie Checklist

Controleer of alles werkt:

- [ ] Supabase project is aangemaakt
- [ ] Environment variables zijn ingesteld in `.env.local`
- [ ] Database tabellen zijn aangemaakt (check in Supabase)
- [ ] Je kunt inloggen op `/cms/login`
- [ ] Je kunt een artikel aanmaken in het CMS
- [ ] Het artikel verschijnt op `/nieuws`
- [ ] De LinkedIn posts API werkt nog steeds

---

## 🚀 Volgende Stappen

Nu het CMS werkt, kun je:

1. **Meer gebruikers toevoegen**:
   - Ga naar CMS → Users
   - Maak editors en viewers aan

2. **Categorieën instellen**:
   - Voeg categorieën toe voor betere organisatie

3. **Media uploaden**:
   - Upload afbeeldingen via het CMS

4. **n8n integratie**:
   - Gebruik de API endpoints voor automatisering
   - Endpoint: `/api/cms/articles`

5. **Productie deployment**:
   - Deploy naar Vercel
   - Gebruik Supabase Pro voor betere performance

---

## 📞 Hulp Nodig?

Als je vastloopt:

1. **Check de logs**:
   ```bash
   # Browser console
   F12 → Console tab
   
   # Server logs
   Check terminal waar npm run dev draait
   ```

2. **Database check**:
   - Ga naar Supabase → Table Editor
   - Controleer of data correct is

3. **Reset alles**:
   ```bash
   # Nuclear option - reset alles
   npm run cms:reset
   npm run cms:setup
   ```

---

## 🎉 Gefeliciteerd!

Je hebt nu een volledig werkend CMS systeem met:
- ✅ Database-driven content
- ✅ Beveiligde authenticatie
- ✅ Real-time updates
- ✅ API voor n8n integratie
- ✅ Schaalbare architectuur

Het systeem is klaar voor productie gebruik! 🚀