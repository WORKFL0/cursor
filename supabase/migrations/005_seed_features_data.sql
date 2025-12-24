-- ============================================================================
-- SEED FEATURES DATA - Sample Product Features
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Add sample features for testing
-- ============================================================================

INSERT INTO features (
  title, slug, description, icon_name, category, display_order, status, published_at,
  meta_title, meta_description
) VALUES
(
  '24/7 Proactieve Monitoring',
  '24-7-proactieve-monitoring',
  'Ons monitoring systeem houdt je IT-infrastructuur dag en nacht in de gaten. We detecteren en verhelpen problemen voordat ze impact hebben op je bedrijf.',
  'Shield',
  'security',
  1,
  'published',
  NOW(),
  '24/7 Monitoring | Workflo Features',
  'Altijd up-to-date met onze 24/7 proactieve monitoring van je IT-infrastructuur'
),
(
  'Snelle Response Tijd',
  'snelle-response-tijd',
  'Gemiddelde reactietijd van 15 minuten. Ons support team staat altijd klaar om je te helpen, via telefoon, email of remote support.',
  'Clock',
  'support',
  2,
  'published',
  NOW(),
  'Snelle Response | Workflo Support',
  'Support binnen 15 minuten - altijd bereikbaar voor je IT-vragen'
),
(
  'Automatische Backups',
  'automatische-backups',
  'Dagelijkse automatische backups van al je kritieke data. Bewaard op meerdere locaties en regelmatig getest op herstelbaarheid.',
  'HardDrive',
  'security',
  3,
  'published',
  NOW(),
  'Automatische Backups | Workflo',
  'Jouw data veilig met dagelijkse automatische backups op meerdere locaties'
),
(
  'Cybersecurity Bescherming',
  'cybersecurity-bescherming',
  'Complete beveiliging tegen ransomware, phishing en andere cyber dreigingen. Inclusief firewall, antivirus en security awareness training.',
  'Lock',
  'security',
  4,
  'published',
  NOW(),
  'Cybersecurity | Workflo',
  'Bescherm je bedrijf tegen cyber dreigingen met onze complete security oplossing'
),
(
  'Cloud Migratie',
  'cloud-migratie',
  'Migreer veilig naar de cloud met onze expertise. Van planning tot uitvoering, wij regelen alles voor een soepele overgang.',
  'Cloud',
  'productivity',
  5,
  'published',
  NOW(),
  'Cloud Migratie | Workflo',
  'Soepele overgang naar de cloud met Workflo als je partner'
),
(
  'Microsoft 365 Optimalisatie',
  'microsoft-365-optimalisatie',
  'Haal het maximale uit je Microsoft 365 omgeving. Wij helpen met setup, training en optimalisatie.',
  'Settings',
  'productivity',
  6,
  'published',
  NOW(),
  'M365 Optimalisatie | Workflo',
  'Maximaliseer je Microsoft 365 investering met onze optimalisatie dienst'
),
(
  'VoIP Telefonie',
  'voip-telefonie',
  'Moderne zakelijke telefonie via internet. Bespaar kosten en krijg meer functionaliteit dan traditionele telefonie.',
  'Phone',
  'communication',
  7,
  'published',
  NOW(),
  'VoIP Telefonie | Workflo',
  'Moderne zakelijke telefonie met alle functionaliteit die je nodig hebt'
),
(
  'Hardware as a Service',
  'hardware-as-a-service',
  'Altijd moderne apparatuur zonder grote investeringen. Wij leveren, beheren en vervangen je hardware wanneer nodig.',
  'Laptop',
  'productivity',
  8,
  'published',
  NOW(),
  'Hardware as a Service | Workflo',
  'Moderne IT-apparatuur zonder grote investeringen via Hardware as a Service'
)
ON CONFLICT (slug) DO NOTHING;

-- Verify data was inserted
SELECT
  title,
  category,
  status,
  display_order
FROM features
ORDER BY display_order;
