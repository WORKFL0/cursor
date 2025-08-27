# HubSpot Integratie Setup voor Workflo

## Overzicht
Deze handleiding helpt je bij het configureren van de HubSpot integratie voor de Workflo website. De integratie zorgt voor automatische verwerking van nieuwsbriefinschrijvingen en contactformulieren.

## Stap 1: HubSpot Private App Aanmaken

1. Log in op je HubSpot account: https://app-eu1.hubspot.com/
2. Ga naar **Settings** (Instellingen) → **Integrations** → **Private Apps**
3. Klik op **Create a private app** (Privé-app maken)
4. Geef de app een naam: "Workflo Website Integration"
5. Ga naar het **Scopes** tabblad en selecteer deze permissions:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `forms`
   - `communication_preferences.read`
   - `communication_preferences.write`

6. Klik op **Create app** en kopieer de **Access Token** die begint met `pat-eu1-...`

## Stap 2: Environment Variables Configureren

Open het `.env.local` bestand en vul deze waarden in:

```env
# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=pat-eu1-[JOUW-TOKEN-HIER]
HUBSPOT_NEWSLETTER_LIST_ID=1  # Of je specifieke lijst ID
```

## Stap 3: HubSpot Formulier Configuratie Verifiëren

De huidige configuratie gebruikt:
- **Portal ID**: 26510736
- **Form ID**: e92de02c-71b0-4a68-aedd-3b6acb0f5f67
- **Region**: eu1

Controleer deze waarden in HubSpot:
1. Ga naar **Marketing** → **Lead Capture** → **Forms**
2. Open je nieuwsbrief formulier
3. Klik op **Embed** of **Share**
4. Verifieer dat de Portal ID en Form ID overeenkomen

## Stap 4: Email Service (Resend) Configureren

Voor email notificaties gebruiken we Resend:

1. Maak een account aan op https://resend.com
2. Ga naar **API Keys** in het dashboard
3. Maak een nieuwe API key aan
4. Voeg toe aan `.env.local`:

```env
# Email Service Configuration (Resend)
RESEND_API_KEY=re_[JOUW-KEY-HIER]
```

## Stap 5: Testen

1. Start de development server opnieuw:
```bash
npm run dev
```

2. Test het nieuwsbrief formulier op de homepage
3. Controleer in HubSpot of de contact is aangemaakt
4. Test het contactformulier op `/contact`

## Probleemoplossing

### Formulier laadt niet
- Controleer of de Form ID correct is
- Verifieer dat scripts van js-eu1.hsforms.net kunnen laden
- Check browser console voor JavaScript errors

### 401 Authentication Errors
- Controleer of de Access Token correct is
- Verifieer dat de Private App de juiste permissions heeft
- Token mag niet verlopen zijn

### Formulier styling issues
- Het formulier gebruikt automatische styling die past bij de website
- Custom CSS wordt toegepast via JavaScript na het laden

### DOM Manipulation Errors
- De website heeft ingebouwde error boundaries die deze errors opvangen
- Het formulier valt automatisch terug op een simpeler alternatief als HubSpot faalt

## Contactgegevens voor Support

Voor hulp met de HubSpot integratie:
- Check eerst de [HubSpot Developer Docs](https://developers.hubspot.com/docs/api/overview)
- Voor Workflo-specifieke vragen: contact@workflo.it

## Belangrijke URLs

- **HubSpot Portal**: https://app-eu1.hubspot.com/portal/26510736
- **Forms Dashboard**: https://app-eu1.hubspot.com/forms/26510736
- **Contacts**: https://app-eu1.hubspot.com/contacts/26510736

## Checklist voor Go-Live

- [ ] HubSpot Access Token is geconfigureerd
- [ ] Resend API key is geconfigureerd  
- [ ] Nieuwsbrief formulier werkt op homepage
- [ ] Contact formulier werkt op /contact pagina
- [ ] Inschrijvingen komen binnen in HubSpot
- [ ] Email notificaties werken correct
- [ ] Geen JavaScript errors in production build
- [ ] GDPR/AVG compliance is gecontroleerd