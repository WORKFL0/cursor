# 🚀 Setup CMS met je BESTAANDE Supabase Account

## ✅ Je hebt al een Supabase project!
Project ID: `wmasliwvesxtzmlxngoe`
URL: `https://wmasliwvesxtzmlxngoe.supabase.co`

## 📋 Stap 1: Haal de ontbrekende Service Role Key op (2 minuten)

1. **Login op Supabase**:
   - Ga naar: https://supabase.com/dashboard
   - Je project heet waarschijnlijk iets als `workflo` of `workflo-cms`

2. **Ga naar Settings → API**:
   - Scroll naar beneden naar "Project API keys"
   - Zoek "service_role" (secret)
   - Klik op "Reveal" 
   - Kopieer de key (begint met `eyJhbGc...`)

3. **Update je .env.local**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...plak-hier-je-service-role-key
   ```

## 📋 Stap 2: Voeg JWT Secret toe (30 seconden)

Genereer een JWT secret:
```bash
openssl rand -base64 32
```

Voeg toe aan .env.local:
```env
JWT_SECRET=je-gegenereerde-secret-hier
AUTH_SECRET=dezelfde-secret-als-jwt-secret
```

## 📋 Stap 3: Run de Database Migrations (3 minuten)

1. **Open Supabase SQL Editor**:
   - Ga naar: https://supabase.com/dashboard/project/wmasliwvesxtzmlxngoe/sql
   - Klik op "+ New query"

2. **Kopieer deze SQL en run het**:
   ```sql
   -- Check if tables already exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Als je GEEN 'articles' tabel ziet**, run dan:
   - Open het bestand: `/supabase/migrations/001_initial_cms_schema.sql`
   - Kopieer ALLES
   - Plak in SQL editor
   - Klik "Run"

## 📋 Stap 4: Setup Script Runnen (1 minuut)

Stop eerst de huidige server (Ctrl+C), dan:

```bash
# Installeer dependencies
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken

# Voeg dit script toe aan package.json
npm pkg set scripts.cms:setup="tsx scripts/setup-supabase-cms.ts"

# Run de setup
npm run cms:setup
```

## 📋 Stap 5: Test het CMS (1 minuut)

```bash
# Start de server
npm run dev
```

1. **Login op CMS**: http://localhost:3000/cms/login
   - Email: `admin@workflo.it`
   - Password: `Admin123!`

2. **Bekijk artikelen**: http://localhost:3000/nieuws

## ⚡ Quick Fix als iets niet werkt:

Als je errors krijgt, check:

1. **Service Role Key probleem?**
   ```bash
   # Test de connectie
   curl https://wmasliwvesxtzmlxngoe.supabase.co/rest/v1/ \
     -H "apikey: je-service-role-key" \
     -H "Authorization: Bearer je-service-role-key"
   ```

2. **Database tables niet aangemaakt?**
   - Ga direct naar: https://supabase.com/dashboard/project/wmasliwvesxtzmlxngoe/editor
   - Check of de tables er zijn
   - Zo niet, run de migration SQL opnieuw

3. **Login werkt niet?**
   - Check of JWT_SECRET is ingesteld
   - Check of de 'users' table bestaat in Supabase

## ✅ Klaar!

Je gebruikt nu je bestaande Supabase project met een volledig werkend CMS systeem.
Geen nieuw account nodig, alles draait op je huidige setup! 🎉