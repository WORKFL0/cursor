/**
 * Script to upload news articles to Supabase blog CMS
 *
 * Run with: npx tsx scripts/upload-blog-articles.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ArticleData {
  title: string
  date: string
  content: string
  url: string
}

const articles: ArticleData[] = [
  {
    title: "De Cyberbeveiligingswet komt eraan – maar wanneer, en hoe bereid je je voor?",
    date: "2025-10-31",
    content: "De Europese cyberbeveiligingswet (Cbw) of NIS2 komt eraan. Het artikel legt uit dat de invoering is uitgesteld tot kwartaal 2 van 2026 en beschrijft wat de wet inhoudt. Het benadrukt de noodzaak om tijdig te voldoen en raadt organisaties aan om zich alvast voor te bereiden met hulpmiddelen zoals de NIS2 Cyber Score, het uitvoeren van een risicoanalyse, implementeren van beveiligingsmaatregelen (zoals MFA, patchbeheer) en het verhogen van bewustwording onder medewerkers.",
    url: "https://workflo.it/de-cyberbeveiligingswet-komt-eraan-maar-wanneer-en-hoe-bereid-je-je-voor/2025/10/31/"
  },
  {
    title: "ChatGPT doorzoekt nu je eigen zakelijke bronnen effectiever",
    date: "2025-10-31",
    content: "OpenAI heeft ChatGPT Business/Enterprise/Education geüpdatet zodat het eigen bedrijfsbronnen (bijv. GitHub, Google Drive, Slack, SharePoint) kan doorzoeken. Dit maakt het mogelijk om een briefing of plan te laten genereren uit interne documenten en om geverifieerde antwoorden te krijgen met bronnen. De update verbetert de zoekfunctie, voegt citaten toe en verhoogt de relevantie voor zakelijke gebruikers.",
    url: "https://workflo.it/chatgpt-doorzoekt-nu-je-eigen-zakelijke-bronnen-effectiever/2025/10/31/"
  },
  {
    title: "Let op: Vraag nog vóór 31 oktober subsidie aan bij Mijn Cyberweerzame Zaak",
    date: "2025-10-22",
    content: "Het bericht waarschuwt dat ondernemers uiterlijk 31 oktober subsidie kunnen aanvragen via het programma Mijn Cyberweerzame Zaak. De subsidie kan worden gebruikt voor maatregelen als netwerkbeveiliging, passwordmanagers, MFA, patchmanagement, antivirus, back-ups, risico-inventarisatie en security awareness-training. Je kunt niet tweemaal subsidie aanvragen voor dezelfde maatregel. Na 31 oktober is aanvragen niet meer mogelijk.",
    url: "https://workflo.it/let-op-vraag-nog-voor-31-oktober-subsidie-aan-bij-mijn-cyberweerzame-zaak/2025/10/22/"
  },
  {
    title: "Wat zijn de voordelen van de nieuwe Anthropic chatbot?",
    date: "2025-10-20",
    content: "Anthropic heeft een nieuw AI‑model, Haiku 4.5, uitgebracht. Dit model is kleiner en goedkoper dan het vorige (Sonnet 4) maar even krachtig, vooral in programmeertaken. Het biedt verbeterde probleemoplossing, meer controle en is veiliger. Er komt ook een integratie met Microsoft Teams, Outlook en OneDrive.",
    url: "https://workflo.it/wat-zijn-de-voordelen-van-de-nieuwe-anthropic-chatbot/2025/10/20/"
  },
  {
    title: "Overheid: 'Update al je apparaten!'",
    date: "2025-10-07",
    content: "De Nederlandse overheid is een campagne gestart om mensen te attenderen op het belang van het up-to-date houden van alle apparaten, inclusief smart devices. Er zouden nog circa 2,5 miljoen niet‑gepatchte apparaten in Nederland zijn. Door updates uit te voeren worden kwetsbaarheden gedicht en wordt cybercriminaliteit tegengegaan. Het artikel roept bedrijven op om collega's te waarschuwen.",
    url: "https://workflo.it/overheid-update-al-je-apparaten/2025/10/07/"
  },
  {
    title: "SIDN: 'Nederlandse bedrijven doen te weinig tegen phishing'",
    date: "2025-10-01",
    content: "SIDN meldt dat 58 % van de Nederlandse organisaties te maken krijgt met phishing. Volgens het onderzoek besteden veel bedrijven slechts beperkte aandacht aan anti‑phishing maatregelen: 61 % treft slechts basismaatregelen en 17 % doet vrijwel niets. Het artikel benadrukt het belang van SPF, DKIM en DMARC en raadt aan om extra maatregelen te nemen tegen phishing.",
    url: "https://workflo.it/sidn-nederlandse-bedrijven-doen-te-weinig-tegen-phishing/2025/10/01/"
  },
  {
    title: "Apple Intelligence deze Oktober ook in Nederland – Dit kun je er straks mee",
    date: "2025-09-23",
    content: "Apple brengt zijn Apple Intelligence‑functies in oktober naar Nederland. Met deze AI‑functies kunnen gebruikers teksten samenvatten, e‑mails herschrijven, real‑time vertalen en beelden opzoeken. De functies zijn beschikbaar op iPhone 15 Pro en nieuwere modellen, en op iPads/Macs met een M1‑chip of nieuwer.",
    url: "https://workflo.it/apple-intelligence-deze-oktober-ook-in-nederland-dit-kun-je-er-straks-mee/2025/09/23/"
  },
  {
    title: "Nederlandse Overheid wil in 2030 in Europese Top 3 staan qua digitalisering MKB. Ben jij er klaar voor?",
    date: "2025-09-23",
    content: "De Nederlandse overheid wil dat het mkb in 2030 tot de Europese top 3 behoort op het gebied van digitalisering. Momenteel behalen mkb‑bedrijven een digitaliseringsscore van 81,5 %. Het artikel spoort ondernemers aan om cloud‑oplossingen, AI‑toepassingen en cybersecurity te omarmen. Het adviseert een digitale audit, enkele quick‑wins (bijv. cloudboekhouding en MFA) en een meerjarig digitaliseringsplan.",
    url: "https://workflo.it/nederlandse-overheid-wil-in-2030-in-europese-top-3-staan-qua-digitalisering-mkb-ben-jij-er-klaar-voor/2025/09/23/"
  },
  {
    title: "30% van ChatGPT gebruik is zakelijk, en meer feitjes uit onderzoek",
    date: "2025-09-23",
    content: "OpenAI onderzocht het gebruik van ChatGPT en ontdekte dat ongeveer 30 % van de toepassingen zakelijk is. De studie verdeelt het gebruik in drie categorieën: 'asking' (49 % stelt vragen), 'doing' (40 % voert taken uit zoals redigeren en opstellen van teksten) en 'expressing' (11 % gebruikt de chatbot om te communiceren). Zakelijke gebruikers passen ChatGPT vooral toe voor redigeren, schrijven en vertalen.",
    url: "https://workflo.it/30-van-chatgpt-gebruik-is-zakelijk-en-meer-feitjes-uit-onderzoek/2025/09/23/"
  },
  {
    title: "Is de nieuwe line-up Apple producten zakelijk interessant?",
    date: "2025-09-10",
    content: "Tijdens de Apple keynote kondigde het bedrijf nieuwe iPhones en iPad‑Air‑modellen aan met betere batterijduur en een 48‑MP camera. AirPods Pro kregen live‑vertaalfuncties en de Apple Watch kan hypertensie detecteren. Het artikel concludeert dat er weinig echt nieuws was voor zakelijke gebruikers en dat er geen nieuwe Macs werden uitgebracht.",
    url: "https://workflo.it/is-de-nieuwe-line-up-apple-producten-zakelijk-interessant/2025/09/10/"
  },
  {
    title: "Beveiligingsupdates Windows 10 eindigen binnenkort. Maak snel de overstap!",
    date: "2025-08-28",
    content: "Windows 10 krijgt nog beveiligingsupdates tot 14 oktober 2025. Daarna stopt de ondersteuning, tenzij je betaalt voor een extra jaar (ongeveer $30). Het artikel raadt gebruikers aan tijdig over te stappen naar Windows 11 om een veilige werkomgeving te behouden. Workflo biedt refurbished computers aan voor wie hardware-upgrade nodig heeft.",
    url: "https://workflo.it/beveiligingsupdates-windows-10-eindigen-binnenkort-maak-snel-de-overstap/2025/08/28/"
  },
  {
    title: "Back to work! Maak je IT klaar voor het nieuwe seizoen",
    date: "2025-08-28",
    content: "Na de zomervakantie is het tijd om de IT-omgeving klaar te maken voor het nieuwe seizoen. Het artikel adviseert om updates uit te voeren op alle systemen, wachtwoorden en toegangsrechten te controleren, back‑ups te testen, e‑mailbeveiliging na te lopen en software‑abonnementen te evalueren.",
    url: "https://workflo.it/back-to-work-neem-even-een-momentje-om-je-it-klaar-te-maken-voor-het-nieuwe-seizoen/2025/08/28/"
  },
  {
    title: "Leuk, GPT‑5, maar wat kun je er echt mee op zakelijk gebied?",
    date: "2025-08-28",
    content: "GPT‑5 introduceert intelligente routering van AI‑modellen, zogenaamde agent-achtige workflows (die automatisch acties uitvoeren via Gmail, Google Calendar, Teams, Outlook, GitHub en Visual Studio) en mini‑/nano‑varianten voor lokale en embedded toepassingen. Deze nieuwe functies verbeteren automatisering en integratie, maar gebruikers moeten nog steeds de resultaten verifiëren.",
    url: "https://workflo.it/leuk-gpt-5-maar-wat-kun-je-er-echt-mee-op-zakelijk-gebied/2025/08/28/"
  },
  {
    title: "Nieuwe ChatGPT model is sneller én privacyvriendelijker",
    date: "2025-08-07",
    content: "OpenAI lanceerde gpt‑oss 120b en 20b, twee nieuwe modellen die lokaal kunnen draaien. Deze modellen bieden privacyvoordelen omdat de data niet naar externe servers wordt verzonden. Ze zijn vooral interessant voor organisaties die met gevoelige informatie werken en bieden bovendien snellere prestaties.",
    url: "https://workflo.it/nieuwe-chatgpt-model-is-sneller-en-privacyvriendelijker/2025/08/07/"
  },
  {
    title: "Is nieuwe AI Lumo de meest privacyvriendelijke chatbot tot nu toe?",
    date: "2025-08-07",
    content: "Proton heeft Lumo gelanceerd, een AI‑chatbot die lokaal draait en end‑to‑end versleuteling gebruikt. Hierdoor worden gesprekken niet gedeeld met de servers van Proton en kunnen gebruikers volledig offline werken. Lumo is beschikbaar via een betaalde abonnementsvorm en richt zich op privacybewuste gebruikers.",
    url: "https://workflo.it/is-nieuwe-ai-lumo-de-meest-privacyvriendelijke-chatbot-tot-nu-toe/2025/08/07/"
  },
  {
    title: "Onderzoek van Check Point: Microsoft, Apple en Google worden door phishers het vaakst misbruikt voor oplichterij",
    date: "2025-08-07",
    content: "Volgens onderzoek van Check Point gebruiken phishers vooral de namen van Microsoft (25 %), Google (11 %) en Apple (9 %) om slachtoffers op te lichten. Criminelen maken realistisch ogende e‑mails en websites om mensen hun gegevens te laten delen. Het artikel adviseert ontvangers om altijd de afzender te verifiëren en geen persoonlijke gegevens te delen via verdachte links.",
    url: "https://workflo.it/onderzoek-van-check-point-microsoft-apple-en-google-worden-door-phishers-het-vaakst-misbruikt-voor-oplichterij/2025/08/07/"
  },
  {
    title: "Let op: WeTransfer mag nu jouw bestanden doorverkopen en gebruiken voor AI",
    date: "2025-07-17",
    content: "WeTransfer is overgenomen door Bending Spoons en heeft zijn algemene voorwaarden aangepast. Volgens de nieuwe voorwaarden mag WeTransfer gebruikersbestanden doorverkopen en gebruiken om AI‑modellen te trainen. Na kritiek is de formulering iets aangepast, maar de strekking blijft hetzelfde. Het artikel raadt aan om geen bedrijfsgevoelige bestanden meer via WeTransfer te versturen en in plaats daarvan alternatieven zoals Gmail/Google Drive of Wormhole (met end‑to‑end encryptie) te gebruiken.",
    url: "https://workflo.it/let-op-wetransfer-mag-nu-jouw-bestanden-doorverkopen-en-gebruiken-voor-ai/2025/07/17/"
  },
  {
    title: "Werken in het buitenland? Vijf tips om dit veilig te doen",
    date: "2025-07-15",
    content: "Met de vakantie voor de deur geeft het artikel vijf tips voor veilig internetgebruik in het buitenland: (1) installeer alle updates voor besturingssysteem en apps; (2) vermijd openbare wifi-netwerken, schakel automatisch verbinden uit en gebruik een VPN; (3) gebruik sterke wachtwoorden of passkeys; (4) werk op een veilige plek, niet op drukke openbare locaties; en (5) zet dataroaming uit om onverwachte kosten en risico's te beperken. Daarnaast adviseert het om een goede firewall te gebruiken.",
    url: "https://workflo.it/werken-in-het-buitenland-vijf-tips-om-dit-veilig-te-doen/2025/07/15/"
  },
  {
    title: "Pointer: Kijk uit met AI‑chatbots, want 'de bron wordt vergiftigd'",
    date: "2025-07-15",
    content: "Het artikel bespreekt onderzoek van Pointer en Nu.nl over de betrouwbaarheid van AI‑chatbots. Chatbots zoals ChatGPT zijn getraind op grote hoeveelheden internetdata, inclusief foutieve informatie. Ze geven liever een antwoord (dat soms onzin kan zijn) dan geen antwoord, wat leidt tot 'hallucinaties'. Kwaadwillende netwerken creëren bewust foute content om de trainingsbron te 'vergiftigen'. De aanbeveling is om antwoorden te controleren via zoekmachines en de bronnen die chatbots noemen te verifiëren.",
    url: "https://workflo.it/pointer-kijk-uit-met-ai-chatbots-want-de-bron-wordt-vergiftigd/2025/07/15/"
  },
  {
    title: "Er is een 'cyber plague' gaande: Infostealers stelen ruim 16 miljard wachtwoorden",
    date: "2025-06-27",
    content: "Cybernews ontdekte dat er in 2025 al 16 miljard gestolen wachtwoorden zijn verzameld door infostealer‑malware. Het gaat om dertig datasets met miljoenen tot miljarden inloggegevens, buitgemaakt door malware die op computers wordt geïnstalleerd. De enorme omvang van deze diefstal onderstreept het belang van overstappen op passkeys (inlogcodes met biometrische verificatie) om accounts beter te beschermen. Lezers worden aangemoedigd om vragen over passkeys te stellen.",
    url: "https://workflo.it/er-is-een-cyber-plague-gaande-infostealers-stelen-ruim-16-miljard-wachtwoorden/2025/06/27/"
  },
  {
    title: "Zomertip: Tijd om je IT‑omgeving op te schonen!",
    date: "2025-06-16",
    content: "Het artikel moedigt bedrijven aan om de zomer te benutten om hun IT‑omgeving op te ruimen. Suggesties zijn: inventariseer alle gebruikersaccounts en verwijder inactieve accounts; verwijder verouderde software en onnodige bestanden; controleer of back‑ups goed werken; voer updates uit; en herzie rechtenstructuren. Een jaarlijkse opruimsessie voorkomt beveiligingslekken en trage systemen.",
    url: "https://workflo.it/zomertip-tijd-om-je-it-omgeving-op-te-schonen/2025/06/16/"
  },
  {
    title: "Deze paar zakelijk interessante functies kondigde Apple aan op WWDC25",
    date: "2025-06-11",
    content: "Tijdens Apple's WWDC25 onthulde het bedrijf een nieuwe 'Liquid Glass' interface die ramen en menu's transparanter maakt. Voor zakelijke gebruikers interessanter zijn updates aan Apple Intelligence: bijvoorbeeld het vergelijken van aantekeningen met audio‑opnamen, betere toegang tot ChatGPT en vertalingen tijdens FaceTime en telefoongesprekken. Spotlight krijgt intelligentere zoekresultaten en een geschiedenis van gekopieerde items. De meeste veranderingen zijn cosmetisch; de software‑updates komen in het najaar.",
    url: "https://workflo.it/deze-paar-zakelijk-interessante-functies-kondigde-apple-gisteren-aan-op-wwdc25/2025/06/11/"
  },
  {
    title: "Eén op de vijf bedrijven lijdt schade door cybercriminaliteit, MKB steeds vaker slachtoffer",
    date: "2025-05-27",
    content: "Uit een onderzoek van ABN AMRO blijkt dat 20 % van de Nederlandse bedrijven in 2024 schade leed door cybercriminaliteit. Hackers richten zich steeds vaker op het mkb. Veel mkb‑bedrijven focussen alleen op preventie (antivirus, firewall) maar niet op detectie en herstel, wat riskant is. Financiële schade kan oplopen tot honderdduizenden euro's per incident. Het artikel verwijst naar het persbericht van ABN AMRO en naar een blog over de Cybersecuritywet.",
    url: "https://workflo.it/een-op-de-vijf-bedrijven-lijdt-schade-door-cybercriminaliteit-mkb-steeds-vaker-slachtoffer/2025/05/27/"
  },
  {
    title: "Gevaarlijk malware netwerk van criminelen ontmanteld",
    date: "2025-05-23",
    content: "Microsoft en internationale autoriteiten hebben het Russische Lumma-malware netwerk opgerold. Deze malware werd op 394 000 Windows‑computers aangetroffen en kon wachtwoorden, creditcardgegevens en crypto‑wallets stelen of bestanden gijzelen. Bij de actie zijn 300 servers offline gehaald en miljoenen euro's beslaggenomen. Het artikel waarschuwt om software altijd via officiële bronnen te downloaden en een firewall en antivirus te gebruiken.",
    url: "https://workflo.it/gevaarlijk-malware-netwerk-van-criminelen-ontmanteld/2025/05/23/"
  },
  {
    title: "De Cyberbeveiligingswet komt eraan. Ben jij erop voorbereid?",
    date: "2025-05-14",
    content: "Deze post introduceert de komende Europese Cyberbeveiligingswet (NIS2/Cbw) die waarschijnlijk in het derde kwartaal van 2025 in werking treedt. Hij legt uit dat de wet geldt voor 'essentiële' en 'belangrijke' organisaties en somt tien zorgplichtmaatregelen op, waaronder risicobeheer, bedrijfscontinuïteitsplanning, incidentrespons, cyberhygiëne, beleid voor netwerkbeveiliging, toeleveringsketenbeveiliging, cryptografie, multi‑factor-authenticatie en effectiviteitsbeoordelingen. Voor niet‑essentiële organisaties worden basismaatregelen aanbevolen om toch aan eisen van partners te kunnen voldoen.",
    url: "https://workflo.it/de-cyberbeveiligingswet-komt-eraan-ben-jij-erop-voorbereid/2025/05/14/"
  },
  {
    title: "Ook Microsoft stapt nu steeds vaker over op Passkeys",
    date: "2025-05-07",
    content: "Het traditionele wachtwoord verdwijnt langzaam en Microsoft ondersteunt nu passkeys in zijn besturingssystemen. Een passkey is een unieke code die door je apparaat wordt gegenereerd en via biometrie (vingerafdruk, gezicht) wordt geautoriseerd. Dit verhoogt de veiligheid en het gebruiksgemak omdat er geen wachtwoorden hoeven te worden onthouden. Nadelen zijn dat je binnen het ecosysteem van Apple of Microsoft moet blijven om passkeys te gebruiken; Workflo adviseert daarom een onafhankelijke oplossing zoals Keeper voor het beheren van inlogs op verschillende platformen.",
    url: "https://workflo.it/ook-microsoft-stapt-nu-steeds-vaker-over-op-passkeys/2025/05/07/"
  },
  {
    title: "Cloud vs. Server-based: Wat is de beste keuze voor jouw bedrijf?",
    date: "2025-04-15",
    content: "Het artikel vergelijkt cloud computing met lokale servers. Voordelen van de cloud zijn lagere investerings- en onderhoudskosten, schaalbaarheid en toegankelijkheid vanaf elke locatie. Nadelen zijn afhankelijkheid van internet en eventuele hogere kosten bij groei. Lokale servers bieden volledige controle en geen maandelijkse clouduitgaven en kunnen geschikter zijn voor zeer gevoelige data, maar vragen hoge initiële investeringen en regelmatig onderhoud en zijn minder schaalbaar. De keuze hangt af van de specifieke behoeften van het bedrijf.",
    url: "https://workflo.it/cloud-vs-server-based-wat-is-de-beste-keuze-voor-jouw-bedrijf/2025/04/15/"
  },
  {
    title: "Welk effect hebben Trump's tarieven op onze tech?",
    date: "2025-04-04",
    content: "Donald Trump kondigde nieuwe importtarieven aan voor Amerikaanse handel, wat waarschijnlijk tot prijsstijgingen in de techsector zal leiden. Het is nog onduidelijk hoe sterk Nederlanders dit zullen merken omdat tech‑producten internationaal geproduceerd worden. Volgens schattingen kan de productie van Apple‑apparaten 9 % duurder worden. Europese tegenmaatregelen kunnen eveneens leiden tot hogere prijzen. Het artikel adviseert om eventueel refurbished elektronica te overwegen en verwijst naar een meer gedetailleerde blogpost van Bright.",
    url: "https://workflo.it/welk-effect-hebben-trumps-tarieven-op-onze-tech/2025/04/04/"
  },
  {
    title: "Welke AI‑chat werkt het beste voor jou? Vijf LLM's en hun voors en tegens",
    date: "2025-03-17",
    content: "Een vergelijking van vijf AI‑chatbots: ChatGPT (breed inzetbaar, maar gegevens t/m okt 2023 en beperkte gratis toegang), Copilot (geoptimaliseerd voor productiviteit binnen Microsoft‑apps, minder geschikt voor complexe programmeertaken), Gemini (Google, levert actuele informatie via live zoekresultaten maar minder krachtig voor diepgaande taken), Claude (Anthropic, hybrid reasoning, sterk in programmeren maar minder compact in antwoorden), en LLaMA (Meta, draait lokaal voor betere privacy maar heeft beperktere kennis en mogelijke ethische biases). De beste keuze hangt af van je behoeften: allround prestaties (ChatGPT), productiviteit (Copilot), actuele info (Gemini), programmeren (Claude) of privacy en offline gebruik (LLaMA).",
    url: "https://workflo.it/welke-ai-chat-werkt-het-beste-voor-jou-vijf-llms-en-hun-voors-en-tegens/2025/03/17/"
  },
  {
    title: "Wij zijn nu een officiële partner van Cisco Meraki",
    date: "2025-03-14",
    content: "Workflo is officieel Cisco Meraki‑partner geworden. Cisco Meraki levert cloudgebaseerde netwerk- en beveiligingsoplossingen, zoals de Meraki MX‑firewalls. Met deze partnerstatus kan Workflo zijn klanten betere totaaloplossingen en scherpe prijzen bieden. De voordelen voor klanten zijn onder meer expertise in Meraki‑producten, kostenefficiënte netwerkoplossingen en uitstekende service en ondersteuning. Workflo kijkt uit naar verdere samenwerking met Cisco Meraki.",
    url: "https://workflo.it/wij-zijn-nu-een-officiele-partner-van-cisco-meraki/2025/03/14/"
  }
]

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper function to determine category based on content
function determineCategory(title: string, content: string): string {
  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()

  if (lowerTitle.includes('cyber') || lowerTitle.includes('beveiliging') ||
      lowerContent.includes('beveiliging') || lowerContent.includes('cybersecurity') ||
      lowerContent.includes('phishing') || lowerContent.includes('malware')) {
    return 'Cybersecurity'
  }

  if (lowerTitle.includes('ai') || lowerTitle.includes('chatgpt') ||
      lowerTitle.includes('gpt') || lowerContent.includes('artificial intelligence') ||
      lowerContent.includes('machine learning')) {
    return 'AI & Innovatie'
  }

  if (lowerTitle.includes('cloud') || lowerTitle.includes('server') ||
      lowerContent.includes('cloud computing')) {
    return 'Cloud'
  }

  if (lowerTitle.includes('apple') || lowerTitle.includes('microsoft') ||
      lowerTitle.includes('windows') || lowerContent.includes('iphone')) {
    return 'Tech News'
  }

  return 'IT Tips'
}

// Helper function to extract tags from content
function extractTags(title: string, content: string, category: string): string[] {
  const tags = new Set<string>()

  // Category-based tags
  tags.add(category)

  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()

  // Common tags
  if (lowerTitle.includes('beveiliging') || lowerContent.includes('beveiliging')) {
    tags.add('Beveiliging')
  }
  if (lowerTitle.includes('ai') || lowerContent.includes('chatgpt') || lowerContent.includes('openai')) {
    tags.add('AI')
  }
  if (lowerContent.includes('mkb') || lowerContent.includes('bedrijven')) {
    tags.add('MKB')
  }
  if (lowerContent.includes('microsoft')) {
    tags.add('Microsoft')
  }
  if (lowerContent.includes('apple')) {
    tags.add('Apple')
  }
  if (lowerContent.includes('google')) {
    tags.add('Google')
  }
  if (lowerContent.includes('wachtwoord') || lowerContent.includes('passkey')) {
    tags.add('Authenticatie')
  }
  if (lowerContent.includes('phishing')) {
    tags.add('Phishing')
  }
  if (lowerContent.includes('update') || lowerContent.includes('patch')) {
    tags.add('Updates')
  }

  return Array.from(tags)
}

// Calculate reading time (Dutch: average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}

async function uploadArticles() {
  console.log('Starting blog article upload...\n')

  // First, get or create categories
  const categoryMap = new Map<string, string>()
  const categories = ['Cybersecurity', 'AI & Innovatie', 'Cloud', 'Tech News', 'IT Tips']

  console.log('Setting up categories...')
  for (const categoryName of categories) {
    const slug = generateSlug(categoryName)

    // Check if category exists
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      categoryMap.set(categoryName, existing.id)
      console.log(`✓ Category "${categoryName}" already exists`)
    } else {
      // Create category
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: categoryName,
          slug,
          description: `Artikelen over ${categoryName}`,
          color: '#3b82f6'
        })
        .select('id')
        .single()

      if (error) {
        console.error(`✗ Error creating category "${categoryName}":`, error)
      } else if (data) {
        categoryMap.set(categoryName, data.id)
        console.log(`✓ Created category "${categoryName}"`)
      }
    }
  }

  // Get the default author (first author in the system)
  const { data: author } = await supabase
    .from('blog_authors')
    .select('id')
    .limit(1)
    .single()

  const authorId = author?.id || null

  console.log('\nUploading articles...\n')

  let successCount = 0
  let errorCount = 0

  for (const article of articles) {
    const slug = generateSlug(article.title)

    // Check if article already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`⊘ Skipping "${article.title}" (already exists)`)
      continue
    }

    const category = determineCategory(article.title, article.content)
    const categoryId = categoryMap.get(category) || null
    const tags = extractTags(article.title, article.content, category)
    const readTime = calculateReadingTime(article.content)

    // Create excerpt from first 200 characters
    const excerpt = article.content.length > 200
      ? article.content.substring(0, 197) + '...'
      : article.content

    const { error } = await supabase
      .from('blog_posts')
      .insert({
        title: article.title,
        slug,
        excerpt,
        content: article.content,
        author_id: authorId,
        category_id: categoryId,
        status: 'published',
        published_at: article.date,
        tags,
        read_time_minutes: readTime,
        canonical_url: article.url,
        publish_to_linkedin: false,
        publish_to_email: false
      })

    if (error) {
      console.error(`✗ Error uploading "${article.title}":`, error)
      errorCount++
    } else {
      console.log(`✓ Uploaded "${article.title}"`)
      console.log(`  Category: ${category}, Tags: ${tags.join(', ')}, Read time: ${readTime} min\n`)
      successCount++
    }
  }

  console.log('\n=== Upload Summary ===')
  console.log(`✓ Successfully uploaded: ${successCount}`)
  console.log(`✗ Errors: ${errorCount}`)
  console.log(`Total articles processed: ${articles.length}`)
}

// Run the upload
uploadArticles()
  .then(() => {
    console.log('\nUpload completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nFatal error:', error)
    process.exit(1)
  })
