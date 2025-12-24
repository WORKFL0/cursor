/**
 * Script to upload second batch of blog articles to Supabase blog CMS
 *
 * Run with: ADMIN_TOKEN=your_token npx tsx scripts/upload-blog-articles-batch2.ts
 */

interface ArticleData {
  title: string
  date: string
  content: string
  url: string
}

const articles: ArticleData[] = [
  {
    title: "Skype stopt per 5 mei: dit zijn de beste alternatieven",
    date: "2025-03-07",
    content: "Maak jij nog gebruik van bel‑ en videodienst Skype voor chatcontact en online meetings? Dan wordt het tijd om over te stappen op een andere dienst, want per 5 mei trekt Microsoft de stekker uit Skype, zo meldt NU.nl. Maar wat zijn de beste alternatieven? We zetten er een paar op een rijtje.\n\nMicrosoft Teams: De meest logische overstap vanaf Skype is naar Microsoft Teams. Teams is ideaal voor zowel chat als videovergaderingen, maar je kunt er ook mee samenwerken aan documenten. Microsoft Teams biedt bovendien uitgebreide integraties met andere Microsoft 365‑tools, wat het een krachtige optie maakt wanneer je al gebruikmaakt van andere Microsoft‑producten.\n\nSlack: Slack is simpel gezegd een privé‑chatroom voor je eigen bedrijf – en je kunt daarbinnen weer aparte kanalen aanmaken, zodat je per afdeling of team je eigen omgeving hebt om binnen te communiceren. Maar wist je dat je in Slack ook kunt videobellen? Dit kan via de eigen ingebouwde beloptie, maar je kunt ook externe tools zoals bijvoorbeeld Microsoft Teams integreren. Zo profiteer je niet alleen van de krachtige functies van Slack, maar ook van die naadloze koppeling met je Microsoft‑tools.\n\nGoogle Meet: Als jullie al werken met Google‑tools (zoals Gmail, Google Drive of Agenda), dan is de kans groot dat je deze optie al kent, maar we noemen het toch maar even: Google Meet. Zodra je een afspraak inplant in de kalender, krijg je gelijk een code mee waarmee je kunt inloggen op de online vergadering. Dit kan zowel telefonisch, als op je desktop voor de videovergadering. Ook hier is de dienst volledig geïntegreerd met de andere Google‑tools.\n\nKortom: er is geen nood aan de man met het verdwijnen van Skype, want eigenlijk is de tool al een tijdje ingehaald door een stel alternatieven die veel beter werken. Stap vandaag nog over!",
    url: "https://workflo.it/skype-stopt-per-5-mei-dit-zijn-de-beste-alternatieven/2025/03/07/"
  },
  {
    title: "Wat zijn de snelste internetproviders volgens het laatste onderzoek?",
    date: "2025-03-04",
    content: "Zoek je nog een provider voor mobiel of vast internet op kantoor? Dan is KPN een goede keuze, want ze zijn voor de vierde keer op rij uitgeroepen tot het beste netwerk door Duits onderzoeksbureau Umlaut. We zetten de prestaties van Nederland's grootste netwerken volgens dit onderzoek even op een rijtje.\n\nKPN: Dit is dus de hoogste scoorder, wat betekent dat de snelheid en stabiliteit van hun mobiele 5G‑netwerk het beste scoort in gebieden als de stad, in kleine dorpjes of onderweg. Sterker nog, KPN scoort wereldwijd het beste op dit gebied. Wat vast internet op kantoor betreft, hebben ze het meest stabiele netwerk en scoren ze daarmee 'outstanding', maar ze zijn niet de snelste.\n\nOdido: Voor vast internet scoort Odido het beste in Nederland. Zij behaalden op dit onderdeel 964 punten van de maximaal 1 000, waarmee ze 11 punten hoger scoren dan afgelopen jaar en dus het snelste vaste internet voor op kantoor aanbieden. Ze scoorden sterk op 'downloads'. Wat 5G‑mobiel internet betreft, stond Odido op de tweede plaats, onder KPN.\n\nVodafone / Ziggo: Vodafone is vergeleken met vorig jaar maar met 1 punt gestegen (971 punten) voor hun mobiele 5G‑netwerk en staat dus in dit lijstje op de derde plek. Ziggo, hun aanbieder van vast internet, haalt als enige niet het 'outstanding'‑label, maar moet het doen met 'very good'.\n\nConclusie: als je snelheid én stabiliteit belangrijk vindt, zijn KPN en Odido de beste opties; Ziggo/Vodafone presteren iets minder in dit onderzoek.",
    url: "https://workflo.it/wat-zijn-de-snelste-internetproviders-volgens-het-laatste-onderzoek/2025/03/04/"
  },
  {
    title: "Is de nieuwe AI van Anthropic het beste alternatief voor ChatGPT?",
    date: "2025-02-25",
    content: "Nu DeepSeek bestempeld is als onbetrouwbaar door de Nederlandse Autoriteit Persoonsgegevens (zie ons eerdere bericht) is het fijn dat er een nieuw alternatief voor ChatGPT op de markt is gekomen dat wel betrouwbaar lijkt te zijn. Maak kennis met Claude 3.7 Sonnet van het Amerikaanse Anthropic, dat gisteren gelanceerd is.\n\nBeter in complexe problemen: Het grote verkooppunt van deze AI‑zoekmachine, waar hij beter dan ChatGPT in is, is dat hij complexe problemen kan oplossen. Zo blinkt deze AI uit in wiskunde en programmeeropdrachten, waardoor het een ideale hulp is als je code aan het programmeren bent.\n\nNog steeds niet live zoeken: De kennis van deze AI is up‑to‑date tot oktober 2024. Dit betekent dat hij nog steeds niet live actuele data van het internet haalt, maar dat kan niet lang meer duren. Wil je deze functie nu al gebruiken, dan moet je een betaald abonnement nemen op ChatGPT.\n\nGebruik en prijs: Je kunt nu gebruikmaken van de nieuwe AI‑search module van Anthropic door hun app te downloaden. Claude kun je gratis gebruiken, maar het aantal vragen dat je kunt stellen is beperkt, afhankelijk van de drukte. Voor Claude Pro betaal je € 22 per maand.",
    url: "https://workflo.it/is-de-nieuwe-ai-van-anthropic-het-beste-alternatief-voor-chatgpt/2025/02/25/"
  },
  {
    title: "Hoe schrijf je de perfecte prompt voor ChatGPT?",
    date: "2025-02-25",
    content: "Hoe schrijf je de perfecte prompt (ook wel zoekvraag) voor ChatGPT? Dat is een vraag die steeds belangrijker wordt, nu we steeds meer uit A.I. kunnen halen.\n\nHet artikel raadt aan om je prompt als volgt op te bouwen voor de beste kans op een goed antwoord:\n\n1 – Doel: begin met het definiëren van wat je wilt.\n\n2 – Antwoord‑format: specificeer hoe het antwoord gestructureerd moet zijn (bijvoorbeeld een lijstje, een tabel of een samenvattende tekst).\n\n3 – Waarschuwing: geef aan wat je níet wilt, zodat de chatbot dit kan vermijden.\n\n4 – Context dump: geef alle relevante achtergrondinformatie mee voor betere resultaten.\n\nHet artikel toont een voorbeeld‑prompt waarin deze onderdelen gecombineerd worden, zodat ChatGPT de juiste toon en structuur gebruikt.",
    url: "https://workflo.it/hoe-schrijf-je-de-perfecte-prompt-voor-chatgpt/2025/02/25/"
  },
  {
    title: "5 praktische tips om phishing te voorkomen",
    date: "2025-02-17",
    content: "Vorige week postten we een nieuwsbericht over het onderzoek van Verizon dat aantoonde dat cybercriminaliteit via phishing aan het toenemen is. Het leek ons dus een goed idee om even op een rijtje te zetten hoe je phishing eenvoudig kunt voorkomen, omdat een aanval veel schade kan aanrichten voor je bedrijf.\n\n1 – Train je medewerkers: Verizon meldde dat maar liefst 68 % van de succesvolle cyberaanvallen lukten door een menselijke fout. Het is dus van belang je personeel goed op de hoogte te houden van potentiële gevaren; trainingen zijn een basismaatregel.\n\n2 – Gebruik MFA: Multi‑Factor Authenticatie voegt een extra beveiligingslaag toe aan inlogprocedures. Zelfs als een medewerker per ongeluk inloggegevens deelt, kan een hacker zonder extra verificatie niet inloggen.\n\n3 – Controleer je e‑mailverificatie‑instellingen: implementeer beveiligingsstandaarden zoals SPF, DKIM en DMARC om te voorkomen dat cybercriminelen zich voordoen als jouw bedrijf.\n\n4 – Gebruik beveiligingssoftware: installeer betrouwbare antivirussoftware en e‑mailfilters om schadelijke berichten automatisch te blokkeren.\n\n5 – Beperk toegangsrechten: geef medewerkers alleen toegang tot systemen en gegevens die ze echt nodig hebben; zo beperk je de schade bij een inbraak.\n\nConclusie: phishing kan grote schade aanrichten en boetes opleveren. Met de juiste training en beveiliging kun je jouw bedrijf relatief eenvoudig beschermen.",
    url: "https://workflo.it/5-praktische-tips-om-phishing-te-voorkomen/2025/02/17/"
  },
  {
    title: "Verizon: Phishing was in 2024 driemaal vaker de oorzaak van cyberaanvallen bij bedrijven",
    date: "2025-02-13",
    content: "Het Amerikaanse telecombedrijf Verizon heeft weer zijn jaarlijkse bevindingen gepubliceerd op het gebied van cybersecurity. Eén van de belangrijkste bevindingen is de schrikbarende stijging van succesvolle phishingpogingen, die driemaal hoger ligt dan het jaar ervoor.\n\nDe belangrijkste reden waarom deze pogingen vaker slagen, is dat ze steeds geraffineerder worden. Waren de mails voorheen duidelijk te herkennen als bizarre verhalen (zoals de Irani­sche prins die zijn nalatenschap aan jou nalaat), tegenwoordig lijken phishing‑mails afkomstig van HR of andere bedrijfsafdelingen.\n\nDaarnaast rapporteert Verizon dat maar liefst 68 % van de succesvolle aanvallen komt door een menselijke fout. Het artikel benadrukt dus dat bewustwording onder personeel cruciaal is en adviseert organisaties om goede virusscanners, firewalls en tweefactorauthenticatie te implementeren zodat phishers niet zomaar kunnen binnendringen.",
    url: "https://workflo.it/verizon-phishing-was-in-2024-driemaal-vaker-de-oorzaak-van-cyberaanvallen-bij-bedrijven/2025/02/13/"
  },
  {
    title: "Autoriteit Persoonsgegevens waarschuwt voor DeepSeek",
    date: "2025-02-13",
    content: "We benoemden het al kort in ons artikel vorige week over de nieuwe razend populaire AI‑chatbot DeepSeek, maar nu waarschuwt de Nederlandse Autoriteit Persoonsgegevens er ook voor: DeepSeek geeft mogelijk je persoonsgegevens door aan China, dus beperk je gebruik ervan en zet nooit gevoelige informatie in je zoekvraag.\n\nVolgens EU‑regelgeving moeten gebruikers die persoonlijke gegevens aan diensten buiten de EU afstaan, goed geïnformeerd worden over wat er met deze gegevens gebeurt. De AP stelt dat dit niet duidelijk is bij DeepSeek en dat gegevens op Chinese servers worden opgeslagen, die in principe door de Chinese overheid kunnen worden ingezien.\n\nHet advies luidt daarom: gebruik DeepSeek voorlopig alleen voor niet‑gevoelige zoekvragen en overweeg het vertrouwde ChatGPT als veiliger alternatief, omdat OpenAI transparanter is over dataverwerking.",
    url: "https://workflo.it/autoriteit-persoonsgegevens-waarschuwt-voor-deepseek/2025/02/13/"
  },
  {
    title: "Waarom is Chinese AI DeepSeek ineens razendpopulair?",
    date: "2025-01-28",
    content: "De Chinese AI‑zoekmachine DeepSeek kan weleens de rivaal van OpenAI zijn die ChatGPT van de troon stoot. Dus als je nog een alternatief voor ChatGPT zoekt, dan kan deze zoekmachine een goede optie zijn. Sinds de nieuwe release van afgelopen maand (het R1‑model) schoot de app in veel landen tot bovenaan alle downloadlijstjes, ook in Nederland.\n\nHet artikel wijst op een belangrijk aandachtspunt: DeepSeek is een Chinese organisatie, wat privacyproblemen kan opleveren. Net zoals er zorgen zijn over TikTok en mogelijke spionage, kunnen dezelfde zorgen ook gelden voor DeepSeek.\n\nPositief is dat DeepSeek volledig gratis is, terwijl ChatGPT een beperkt aantal vragen toestaat en daarna een betaald abonnement vraagt voor de krachtigste versie. DeepSeek zegt dezelfde resultaten te halen als ChatGPT maar tegen 90–95 % lagere kosten – hoe dit mogelijk is en welke data zijn gebruikt, is onbekend.\n\nConclusie: DeepSeek is een interessante, gratis AI‑zoekmachine om te volgen, maar gebruikers moeten zich bewust zijn van de mogelijke privacyrisico's.",
    url: "https://workflo.it/waarom-is-chinese-ai-deepseek-ineens-razendpopulair/2025/01/28/"
  },
  {
    title: "GDPR voor beginners: Implementeer de privacy­regelgeving zonder hoofdpijn",
    date: "2025-01-23",
    content: "Deze regelgeving (in het Nederlands ook wel de AVG, Algemene Verordening Gegevensbescherming) beschermt de gegevens die jouw klanten met je delen. En voldoe je er niet aan, dan riskeer je hoge boetes. Toch voldoet volgens het laatste onderzoek zo'n tweederde van de bedrijven in Nederland niet aan de GDPR.\n\nOm zonder hoofdpijn te beginnen, geeft het artikel zes praktische tips:\n\n1 – Ken je datastromen: maak een overzicht van welke persoonsgegevens je verzamelt, waarom en hoe je ze verwerkt.\n\n2 – Privacy by Design: integreer privacy vanaf het begin; verzamel alleen noodzakelijke data en gebruik encryptie.\n\n3 – Zorg voor transparantie: communiceer duidelijk met klanten via een begrijpelijke privacy­verklaring.\n\n4 – Beveiliging is essentieel: implementeer sterke beveiliging, zoals tweefactorauthenticatie en regelmatige updates.\n\n5 – Documenteer alles: houd een register bij van verwerkingsactiviteiten voor audits en toezicht.\n\n6 – Vraag juridisch advies waar nodig: schakel een expert in bij twijfel.\n\nDoor deze stappen op te volgen, bouw je documentatie op en toon je aan dat je actief aan GDPR‑compliance werkt.",
    url: "https://workflo.it/gdpr-voor-beginners-implementeer-de-privacyregelgeving-zonder-hoofdpijn/2025/01/23/"
  },
  {
    title: "Tip: Zo ontloop je de prijsstijgingen van Microsoft Office",
    date: "2025-01-17",
    content: "Heb jij ook een abonnement op Microsoft Office‑producten, zoals Word, Excel en PowerPoint? Dan heb je misschien gemerkt dat de prijzen stijgen met € 3 per maand. De reden hiervoor is dat Microsoft hun AI‑assistent CoPilot nu geïntegreerd heeft in Office.\n\nDe toevoeging van CoPilot biedt diverse voordelen – je kunt bijvoorbeeld hulp vragen bij formules in Excel of teksten in Word. Wil je de prijsverhoging niet betalen, dan kun je die omzeilen door te kiezen voor de abonnementen Personal Classic en Family Classic, zo meldt techsite Bright.\n\nDeze worden aangeboden voor de oude prijs en bevatten CoPilot niet. Je kunt deze abonnementsvormen kiezen wanneer je je oude abonnement annuleert; Microsoft toont je dan de opties.",
    url: "https://workflo.it/tip-zo-ontloop-je-de-prijsstijgingen-van-microsoft-office/2025/01/17/"
  }
]

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper function to determine category based on content
function determineCategory(title: string, content: string): string {
  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()

  if (lowerTitle.includes('cyber') || lowerTitle.includes('beveiliging') || lowerTitle.includes('phishing') ||
      lowerContent.includes('beveiliging') || lowerContent.includes('cybersecurity') ||
      lowerContent.includes('phishing') || lowerContent.includes('malware') || lowerContent.includes('gdpr') ||
      lowerContent.includes('privacy')) {
    return 'Cybersecurity'
  }

  if (lowerTitle.includes('ai') || lowerTitle.includes('chatgpt') || lowerTitle.includes('deepseek') ||
      lowerTitle.includes('anthropic') || lowerTitle.includes('claude') ||
      lowerContent.includes('chatgpt') || lowerContent.includes('openai') || lowerContent.includes('deepseek')) {
    return 'AI & Innovatie'
  }

  if (lowerTitle.includes('internet') || lowerTitle.includes('provider') || lowerTitle.includes('kpn') ||
      lowerContent.includes('netwerk') || lowerContent.includes('5g')) {
    return 'Tech News'
  }

  if (lowerTitle.includes('microsoft') || lowerTitle.includes('office') || lowerTitle.includes('skype') ||
      lowerTitle.includes('teams') || lowerContent.includes('microsoft')) {
    return 'Tech News'
  }

  return 'IT Tips'
}

// Helper function to extract tags from content
function extractTags(title: string, content: string, category: string): string[] {
  const tags = new Set<string>()

  tags.add(category)

  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()

  if (lowerTitle.includes('beveiliging') || lowerContent.includes('beveiliging')) {
    tags.add('Beveiliging')
  }
  if (lowerTitle.includes('ai') || lowerContent.includes('chatgpt') || lowerContent.includes('openai') ||
      lowerContent.includes('deepseek') || lowerContent.includes('anthropic')) {
    tags.add('AI')
  }
  if (lowerContent.includes('mkb') || lowerContent.includes('bedrijven')) {
    tags.add('MKB')
  }
  if (lowerContent.includes('microsoft') || lowerTitle.includes('microsoft')) {
    tags.add('Microsoft')
  }
  if (lowerContent.includes('google') || lowerTitle.includes('google')) {
    tags.add('Google')
  }
  if (lowerContent.includes('phishing')) {
    tags.add('Phishing')
  }
  if (lowerContent.includes('gdpr') || lowerContent.includes('avg') || lowerContent.includes('privacy')) {
    tags.add('Privacy')
  }
  if (lowerContent.includes('authenticatie') || lowerContent.includes('mfa')) {
    tags.add('Authenticatie')
  }

  return Array.from(tags)
}

// Calculate reading time (Dutch: average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}

// Generate featured image URL based on category
function getFeaturedImage(category: string): string {
  const images: Record<string, string> = {
    'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
    'AI & Innovatie': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    'Cloud': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=630&fit=crop',
    'Tech News': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
    'IT Tips': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop'
  }

  return images[category] || images['IT Tips']
}

async function uploadArticles() {
  const token = process.env.ADMIN_TOKEN

  if (!token) {
    console.error('ERROR: ADMIN_TOKEN environment variable is not set!')
    console.error('\nPlease set ADMIN_TOKEN and run this script with:')
    console.error('   ADMIN_TOKEN=your_token_here npx tsx scripts/upload-blog-articles-batch2.ts\n')
    process.exit(1)
  }

  console.log('Starting blog article upload (batch 2) via API...\n')

  const baseUrl = 'http://localhost:3000'
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const article of articles) {
    const slug = generateSlug(article.title)
    const category = determineCategory(article.title, article.content)
    const tags = extractTags(article.title, article.content, category)
    const readTime = calculateReadingTime(article.content)
    const featuredImage = getFeaturedImage(category)

    const excerpt = article.content.length > 200
      ? article.content.substring(0, 197) + '...'
      : article.content

    try {
      const response = await fetch(`${baseUrl}/api/admin/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: article.title,
          slug,
          excerpt,
          content: article.content,
          featured_image: featuredImage,
          status: 'published',
          published_at: article.date,
          tags,
          read_time_minutes: readTime,
          canonical_url: article.url,
          publish_to_linkedin: false,
          publish_to_email: false
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409 || data.error?.includes('duplicate') || data.code === 'DUPLICATE_SLUG') {
          console.log(`⊘ Skipping "${article.title}" (already exists)`)
          skippedCount++
        } else {
          console.error(`✗ Error uploading "${article.title}":`, data.error)
          errorCount++
        }
      } else {
        console.log(`✓ Uploaded "${article.title}"`)
        console.log(`  Category: ${category}, Tags: ${tags.join(', ')}, Read time: ${readTime} min`)
        console.log(`  Image: ${featuredImage}\n`)
        successCount++
      }
    } catch (error) {
      console.error(`✗ Network error uploading "${article.title}":`, error)
      errorCount++
    }
  }

  console.log('\n=== Upload Summary ===')
  console.log(`✓ Successfully uploaded: ${successCount}`)
  console.log(`⊘ Skipped (already exist): ${skippedCount}`)
  console.log(`✗ Errors: ${errorCount}`)
  console.log(`Total articles processed: ${articles.length}`)
}

uploadArticles()
  .then(() => {
    console.log('\nUpload completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nFatal error:', error)
    process.exit(1)
  })
