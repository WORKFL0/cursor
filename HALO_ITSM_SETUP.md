# Halo ITSM Integratie Setup

## Overzicht
De chatbot is geïntegreerd met Workflo's Halo ITSM service desk op https://servicedesk.workflo.it. Dit maakt het mogelijk om:
- Support tickets automatisch aan te maken vanuit chatgesprekken
- Ticket status op te vragen
- Volledige gesprekgeschiedenis mee te sturen met tickets

## Configuratie

### 1. Kopieer het .env.local.example bestand
```bash
cp .env.local.example .env.local
```

### 2. Vul de Halo ITSM credentials in
Bewerk `.env.local` en voeg de volgende waarden toe:

```env
# Halo ITSM Configuration
HALO_API_URL=https://servicedesk.workflo.it
HALO_CLIENT_ID=<vraag aan bij IT>
HALO_CLIENT_SECRET=<vraag aan bij IT>
HALO_TENANT_ID=workflo
HALO_AUTH_METHOD=oauth
```

### 3. Alternatief: API Key authenticatie
Als je een API key hebt in plaats van OAuth credentials:

```env
HALO_AUTH_METHOD=apikey
HALO_API_KEY=<jouw api key>
```

## Mock Mode (Ontwikkeling)

Als er geen credentials zijn geconfigureerd, draait de integratie automatisch in **mock mode**:
- Tickets krijgen een MOCK- prefix (bijv. MOCK-123456)
- Geen echte API calls naar Halo
- Perfect voor ontwikkeling en testen
- Console logs tonen de mock tickets

## Chatbot Functies

### Ticket Aanmaken
Gebruikers kunnen tickets aanmaken door te zeggen:
- "Ik wil een ticket aanmaken"
- "Maak een ticket"
- "Probleem melden"
- "Storing melden"
- "Ik heb technische ondersteuning nodig"

### Automatische Prioriteit
De bot bepaalt automatisch de prioriteit op basis van keywords:
- **Critical**: "down", "niet bereikbaar", "urgent", "storing", "uitval"
- **High**: "error", "fout", "werkt niet", "probleem", "kapot"
- **Normal**: standaard voor andere issues
- **Low**: "vraag", "informatie", "hoe", "wat"

### Ticket Informatie
Elk ticket bevat:
- Complete gesprekgeschiedenis
- Gebruikersinformatie (naam, email, telefoon, bedrijf)
- Sessie ID voor tracking
- Timestamp en metadata
- Automatische categorisering

## Test Instructies

### 1. Start de development server
```bash
npm run dev
```

### 2. Open de website
Ga naar http://localhost:3000

### 3. Test de chatbot
1. Klik op het chat icoon rechtsonder
2. Typ: "Ik wil een ticket aanmaken"
3. Beschrijf het probleem
4. De bot maakt een ticket aan (MOCK- in development mode)

### 4. Bekijk de logs
In de terminal zie je:
```
Halo ITSM running in mock mode - configure credentials in .env.local
Mock ticket created: {
  ticketNumber: 'MOCK-123456',
  issue: '...',
  userInfo: {...},
  sessionId: '...'
}
```

## Productie Setup

Voor productie gebruik:

1. **Verkrijg echte Halo credentials** van het IT team
2. **Update .env.local** met de productie credentials
3. **Test de integratie** met een test ticket
4. **Monitor de logs** voor authenticatie fouten

## API Endpoints

### Chat API met ticket support
`POST /api/ai/chat`
```json
{
  "message": "beschrijving van het probleem",
  "sessionId": "...",
  "userInfo": {
    "name": "...",
    "email": "...",
    "phone": "...",
    "company": "..."
  },
  "createTicket": true
}
```

### Direct ticket management
`POST /api/halo/ticket`
```json
{
  "action": "create|status",
  "issue": "probleem beschrijving",
  "ticketId": "voor status check",
  "userInfo": {...}
}
```

## Troubleshooting

### "Authentication failed" error
- Controleer of de credentials correct zijn in .env.local
- Verifieer dat de Halo API bereikbaar is
- Check of de auth method (oauth/apikey) correct is

### "Mock ticket created" in productie
- Dit betekent dat er geen geldige credentials zijn
- Check .env.local configuratie
- Herstart de development server na wijzigingen

### Chatbot reageert niet op ticket verzoeken
- Controleer de browser console voor errors
- Verifieer dat de API endpoints bereikbaar zijn
- Check de server logs met `npm run dev`

## Contact

Voor Halo ITSM credentials en support:
- IT Team: support@workflo.it
- ServiceDesk: https://servicedesk.workflo.it