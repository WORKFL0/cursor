-- ============================================================================
-- SEED CASE STUDIES DATA - Sample Success Stories
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Add sample case studies for testing
-- ============================================================================

INSERT INTO case_studies (
  client_name, client_industry, client_size, client_location,
  title, slug, tagline,
  challenge, solution, results,
  testimonial, testimonial_author, testimonial_role,
  featured_image_url,
  metrics,
  services_used, tags,
  is_featured, display_order, status, published_at,
  meta_title, meta_description,
  project_completed_at
) VALUES
(
  'MediCare Kliniek Amsterdam',
  'healthcare',
  '50-200',
  'Amsterdam',
  'Van Onveilig naar ISO 27001 Compliant in 6 Maanden',
  'medicare-kliniek-iso-27001',
  'Hoe een medische kliniek volledige compliance behaalde zonder IT-kennis in huis',
  'MediCare had geen dedicated IT-afdeling en kampte met verouderde systemen. De kliniek moest voldoen aan strenge GDPR en NEN7510 eisen maar had geen expertise in huis. Security audits toonden ernstige kwetsbaarheden aan.',
  'Workflo implementeerde een complete Managed IT oplossing inclusief:
- 24/7 security monitoring
- Automatische patch management
- Encrypted backup systeem
- Staff security awareness training
- ISO 27001 documentatie en processen
- GDPR compliance toolkit',
  'Binnen 6 maanden behaalde MediCare ISO 27001 certificering. De kliniek werkt nu met volledig beveiligde systemen en voldoet aan alle compliance eisen. Downtime is met 95% afgenomen en het medisch personeel kan zich focussen op patiëntenzorg.',
  'Workflo heeft ons compleet ontzorgd. We hebben nu een IT-infrastructuur waar we volledig op kunnen vertrouwen, zonder dat we er zelf naar om hoeven te kijken. De ISO certificering leek onhaalbaar, maar Workflo maakte het mogelijk.',
  'Dr. Sarah van Dijk',
  'Directeur MediCare Kliniek',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
  '{"uptime": "99.95%", "downtime_reduction": "95%", "compliance": "ISO 27001", "time_to_compliance": "6 months"}',
  ARRAY['managed-it', 'cybersecurity', 'backup-herstel'],
  ARRAY['healthcare', 'compliance', 'security', 'gdpr'],
  true,
  1,
  'published',
  NOW() - INTERVAL '30 days',
  'MediCare Kliniek Success Story | ISO 27001 in 6 Maanden',
  'Ontdek hoe MediCare Kliniek ISO 27001 certificering behaalde met Workflo Managed IT',
  '2024-10-15'
),
(
  'FinTech Startup BV',
  'finance',
  '10-50',
  'Amsterdam',
  'Schaalbare Cloud Infrastructuur voor Snelgroeiende FinTech',
  'fintech-startup-cloud-migratie',
  'Van single server naar enterprise cloud in 3 maanden',
  'Deze scale-up groeide van 10 naar 50 medewerkers in 1 jaar. Hun IT-infrastructuur (1 lokale server) kon de groei niet bijbenen. Regelmatige crashes, trage performance en security zorgen remden de groei.',
  'Workflo migreerde de complete infrastructuur naar Microsoft Azure:
- High-availability cloud setup
- Auto-scaling architectuur
- Multi-region backup
- Advanced security (MFA, conditional access)
- DevOps pipeline voor snelle deployments
- 24/7 monitoring',
  'De nieuwe infrastructuur schaalt automatisch mee met de groei. Performance verbeterde met 400%, kosten daalden met 30% en downtime is vrijwel verdwenen. Het bedrijf kan nu focussen op product development in plaats van IT-problemen.',
  'We waren continu bezig met IT-problemen. Workflo heeft ons bevrijd van die zorgen en gaf ons een platform dat meegroeit. De migratie was naadloos en we hebben geen seconde productiviteit verloren.',
  'Mark Jansen',
  'CTO FinTech Startup',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
  '{"performance_improvement": "400%", "cost_reduction": "30%", "uptime": "99.98%", "migration_time": "3 months"}',
  ARRAY['cloud', 'managed-it', 'microsoft-365'],
  ARRAY['fintech', 'cloud-migration', 'scaling', 'azure'],
  true,
  2,
  'published',
  NOW() - INTERVAL '60 days',
  'FinTech Cloud Migratie Success Story | 400% Performance Boost',
  'Leer hoe een FinTech startup schaalde met Azure cloud infrastructuur van Workflo',
  '2024-09-01'
),
(
  'Retail Keten Nederland',
  'retail',
  '200+',
  'Landelijk',
  'Unified Communications voor 50 Retail Locaties',
  'retail-keten-voip-telefonie',
  'Van 50 lokale telefoonsystemen naar 1 geïntegreerde oplossing',
  'De retailketen had 50 winkels met elk een eigen telefoonsysteem. Dit leidde tot hoge kosten, geen centrale controle en slechte bereikbaarheid. Customer service was versnipperd over locaties.',
  'Workflo implementeerde een landelijke VoIP oplossing:
- Centraal telefoonsysteem voor alle 50 locaties
- Intelligent call routing naar beschikbare medewerkers
- Integratie met CRM systeem
- Analytics dashboard voor management
- Mobiele apps voor flexibel werken
- Kostenbesparende belplannen',
  'Telefoonkosten daalden met 60%. Klanten bereiken nu altijd de juiste medewerker (90% first-call-resolution). Het management heeft real-time inzicht in alle gesprekken en medewerkers kunnen overal werken via de mobiele app.',
  'De VoIP oplossing van Workflo heeft onze customer service getransformeerd. We zijn beter bereikbaar, klanten zijn tevredener en we besparen €50.000 per jaar op telefoonkosten.',
  'Linda Bakker',
  'Operations Manager',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
  '{"cost_reduction": "60%", "first_call_resolution": "90%", "annual_savings": "€50.000", "locations": "50"}',
  ARRAY['voip-telefonie', 'managed-it'],
  ARRAY['retail', 'voip', 'communications', 'multi-location'],
  false,
  3,
  'published',
  NOW() - INTERVAL '90 days',
  'Retail VoIP Success Story | 60% Kostenbesparing',
  'Ontdek hoe een retailketen €50.000 per jaar bespaart met VoIP telefonie van Workflo',
  '2024-08-15'
)
ON CONFLICT (slug) DO NOTHING;

-- Verify data was inserted
SELECT
  client_name,
  client_industry,
  title,
  is_featured,
  status
FROM case_studies
ORDER BY display_order;
