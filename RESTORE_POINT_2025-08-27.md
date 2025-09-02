# Restore Point - 27 Augustus 2025

## Status Overzicht
Dit is een restore point van alle wijzigingen gemaakt aan het Workflo website project.

## Belangrijkste Wijzigingen

### 1. Bug Fixes & Integraties
- ✅ Chatbot Halo ITSM integratie met mock mode werkend
- ✅ Support pagina aangemaakt met 24/7 contact informatie
- ✅ Download pagina bijgewerkt met juiste tools

### 2. Prijzen Correcties (KRITISCH)
- ✅ Microsoft 365 prijzen gecorrigeerd (maandelijks → jaarlijks commitment)
  - Business Basic: €6.00 → €6.90
  - Business Standard: €12.50 → €14.30
  - Business Premium: €22.00 → €25.30
- ✅ 10% korting alleen op support services, NIET op Microsoft licenties
- ✅ Server support prijs: €60 → €90

### 3. Content Correcties
- ✅ ALLE neprecensies en case studies verwijderd
- ✅ Schulte & Lestraden: "advocatenkantoor" → "professional services"
- ✅ Duwtje: "creative agency" → "research/behavioral science"
- ✅ Telefoonnummers gecorrigeerd: 020-30 80 465

### 4. Design Overhaul
- ✅ Complete kleurschema migratie van oranje naar Workflo geel (#f2f400)
- ✅ Team kaarten vergroot op over-ons pagina
- ✅ Alle knoppen en links gefixed

### 5. CMS & Database
- ✅ Nieuws pagina geïntegreerd met Supabase CMS
- ✅ Fallback naar localStorage wanneer Supabase niet beschikbaar is
- ⚠️ Supabase URL lijkt incorrect geconfigureerd

## Huidige Problemen
- Supabase project bestaat niet of URL is incorrect
- SERVICE_ROLE_KEY ontbreekt in .env.local

## Git Commit
- Commit ID: d1876ea
- Message: "Major updates: Complete website overhaul and fixes"
- Datum: 27 Augustus 2025

## Hoe Te Herstellen
1. Navigeer naar de project directory
2. Run: `git checkout d1876ea`
3. Of gebruik de backup in `/backups/backup-2025-08-27T08-10-43/`

## Next Steps
1. Configureer correcte Supabase credentials
2. Test CMS artikel creatie
3. Verifieer alle prijzen nogmaals
4. Deploy naar productie wanneer klaar
