-- ============================================================================
-- SEED BLOG DATA - Sample Articles
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Add sample blog posts for testing
-- ============================================================================

-- Get the Workflo Team author ID
DO $$
DECLARE
  author_id UUID;
  cybersec_cat_id UUID;
  ittips_cat_id UUID;
  msp_cat_id UUID;
BEGIN
  -- Get author ID
  SELECT id INTO author_id FROM blog_authors WHERE email = 'info@workflo.it' LIMIT 1;

  -- Get category IDs
  SELECT id INTO cybersec_cat_id FROM blog_categories WHERE slug = 'cybersecurity' LIMIT 1;
  SELECT id INTO ittips_cat_id FROM blog_categories WHERE slug = 'it-tips' LIMIT 1;
  SELECT id INTO msp_cat_id FROM blog_categories WHERE slug = 'msp-insights' LIMIT 1;

  -- Insert sample blog posts
  INSERT INTO blog_posts (
    title, slug, excerpt, content, author_id, category_id, status, published_at,
    meta_title, meta_description, tags, featured_image, publish_to_linkedin, publish_to_email
  ) VALUES
  (
    'Nieuwe Ransomware Golf Treft Nederlandse Bedrijven',
    'nieuwe-ransomware-golf-treft-nederlandse-bedrijven',
    'De laatste ransomware aanval heeft al meer dan 50 Nederlandse MKB bedrijven getroffen. Leer hoe je jezelf beschermt tegen deze dreiging.',
    '# Wat is er aan de hand?

De afgelopen weken is er een nieuwe golf van ransomware aanvallen gaande die specifiek gericht is op Nederlandse MKB bedrijven. Cybercriminelen maken gebruik van geavanceerde phishing technieken om toegang te krijgen tot bedrijfsnetwerken.

## Hoe werkt de aanval?

1. **Phishing email**: Medewerkers ontvangen een nep-factuur
2. **Malware installatie**: Bij het openen wordt ransomware geïnstalleerd
3. **Encryptie**: Alle bedrijfsbestanden worden versleuteld
4. **Losgeld**: Er wordt €50.000+ gevraagd voor de decryptie sleutel

## Wat kun je doen?

### 1. Implementeer Multi-Factor Authentication (MFA)
MFA voorkomt dat aanvallers met gestolen wachtwoorden toegang krijgen.

### 2. Backup, Backup, Backup
Zorg voor offline backups die niet bereikbaar zijn vanaf het netwerk.

### 3. Train je medewerkers
80% van de cyberaanvallen begint met een medewerker die een verkeerde link klikt.

### 4. Update je systemen
Houd Windows, Office en alle andere software up-to-date.

## Workflo kan helpen

Met onze **Managed Security Services** ben je beschermd:

- 24/7 monitoring van je netwerk
- Automatische patch management
- Security awareness training
- Incident response team

**Vanaf €60/gebruiker/maand** krijg je volledige cybersecurity bescherming.

[Vraag een gratis security scan aan →](/contact)',
    author_id,
    cybersec_cat_id,
    'published',
    NOW(),
    'Nieuwe Ransomware Golf - Bescherm je Bedrijf | Workflo',
    'Leer hoe je je bedrijf beschermt tegen de nieuwe ransomware aanvallen die Nederlandse bedrijven treffen.',
    ARRAY['cybersecurity', 'ransomware', 'phishing', 'backup'],
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
    false,
    false
  ),
  (
    '5 Microsoft 365 Features Die Je Waarschijnlijk Niet Gebruikt',
    '5-microsoft-365-features-die-je-waarschijnlijk-niet-gebruikt',
    'Microsoft 365 zit vol met handige features die de productiviteit verhogen. Ontdek welke je nu al kunt gebruiken!',
    '# Microsoft 365: Meer dan alleen Outlook en Word

De meeste bedrijven gebruiken Microsoft 365, maar wist je dat je waarschijnlijk maar 20% van de beschikbare functionaliteit gebruikt? Hier zijn 5 features die je direct kunt inzetten.

## 1. Microsoft Lists - Projectbeheer zonder extra tools

Vergeet Trello of Asana - Lists is al inbegrepen in je M365 licentie.

**Wat kun je ermee:**
- Taken bijhouden per team
- Custom workflows maken
- Integreren met Teams en SharePoint

## 2. Power Automate - Automatiseer repetitieve taken

**Voorbeelden:**
- Auto-archiveer emails ouder dan 6 maanden
- Verstuur automatisch facturen naar klanten
- Sync Outlook agenda met Excel rapport

**Cost savings:** 5-10 uur per week per medewerker!

## 3. OneDrive Offline Folders

Perfect voor remote werk. Sync specifieke folders voor offline toegang.

## 4. Microsoft Bookings

Klanten kunnen zelf afspraken inplannen zonder email heen-en-weer.

**Ideaal voor:**
- Consultancy bedrijven
- Support afspraken
- Sales meetings

## 5. SharePoint Hubs

Centraliseer al je bedrijfsinformatie op één plek.

## Wil je meer uit Microsoft 365 halen?

Workflo helpt bedrijven het maximale uit hun M365 investering te halen.

**Onze Microsoft 365 Optimization Service:**
- Analyse van huidige gebruik
- Implementatie van best practices
- Training voor medewerkers
- Ongoing support

[Boek een gratis M365 audit →](/contact)',
    author_id,
    ittips_cat_id,
    'published',
    NOW() - INTERVAL '1 day',
    '5 Microsoft 365 Features die je Productiviteit Verhogen',
    'Ontdek 5 hidden features in Microsoft 365 die je bedrijf productiever maken.',
    ARRAY['microsoft-365', 'productivity', 'tips', 'automation'],
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    false,
    false
  ),
  (
    'Waarom Fixed-Fee MSP Beter Is Dan Pay-Per-Hour Support',
    'waarom-fixed-fee-msp-beter-is-dan-pay-per-hour-support',
    'De meeste bedrijven betalen nog steeds per uur voor IT support. Ontdek waarom fixed-fee MSP services veel voordeliger zijn.',
    '# De Echte Kosten van Pay-Per-Hour IT Support

Als je nog steeds €110/uur betaalt voor ad-hoc IT support, ben je waarschijnlijk te veel geld kwijt. Hier is waarom.

## Het Probleem met Uurtarief

**Scenario:** Bedrijf met 10 medewerkers

### Ad-hoc Support Kosten:
- Gemiddeld 1 uur IT support per medewerker per maand
- 10 medewerkers × 1 uur × €110 = **€1.100/maand**
- Jaarlijks: **€13.200**

**Maar dat is niet alles:**
- Geen proactieve monitoring → meer problemen
- Geen preventief onderhoud → langere downtime
- Emergency support (150% tarief) → €165/uur
- **Werkelijke kosten: €18.000-€25.000/jaar**

## Fixed-Fee MSP Alternative

**Workflo MSP Remote:** €60/gebruiker/maand
- 10 medewerkers × €60 = **€600/maand**
- Jaarlijks: **€7.200**

### Wat krijg je?

**Inbegrepen:**
✅ Unlimited support tickets
✅ 24/7 proactieve monitoring
✅ Patch management
✅ Backup monitoring
✅ Email security
✅ Endpoint protection
✅ Strategic IT planning

## De Besparing

| Item | Ad-hoc | MSP | Verschil |
|------|--------|-----|----------|
| Support kosten | €25.000 | €7.200 | **€17.800** |
| Downtime (uren) | 40h | 10h | 30h × €200 = **€6.000** |
| Security breach risico | Hoog | Laag | **Onbetaalbaar** |

**Totale besparing: €23.800/jaar**

## Waarom Wachten?

Switch nu naar Workflo MSP en:
- Bespaar direct 60%+
- Geen verrassingen meer
- Focus op je core business

[Bereken je MSP pakket →](/prijzen)',
    author_id,
    msp_cat_id,
    'draft',
    NULL,
    'Fixed-Fee MSP vs Pay-Per-Hour IT Support - Kostenvergelijking',
    'Bespaar tot 60% op IT kosten door te switchen van pay-per-hour naar fixed-fee MSP services.',
    ARRAY['msp', 'pricing', 'cost-savings', 'managed-it'],
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop',
    false,
    false
  )
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- Verify data was inserted
SELECT
  bp.title,
  bp.status,
  bp.published_at,
  bc.name as category,
  ba.display_name as author
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
ORDER BY bp.created_at DESC;
