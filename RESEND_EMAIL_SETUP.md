# 📧 Resend Email Setup Guide

**Datum**: 2025-11-13
**Status**: Setup vereist

---

## 🎯 Waarom Resend?

Je website gebruikt **Resend** voor alle email functionaliteit. Dit is veel beter dan traditionele SMTP omdat:

- ✅ **Eenvoudiger**: Slechts 1 API key nodig (geen SMTP server configuratie)
- ✅ **Betrouwbaarder**: Geen firewall/port problemen
- ✅ **Betere deliverability**: Professionele email reputatie
- ✅ **Gratis tier**: 100 emails/dag, 3,000/maand
- ✅ **Ingebouwde analytics**: Track opens, clicks, bounces

---

## 📋 Welke Emails Worden Verstuurd?

### 1. Contact Formulier
**Locatie**: `/contact`
- ✉️ Notificatie naar Workflo team (`info@workflo.nl`, `work@workflo.nl`)
- ✉️ Bevestiging naar klant

### 2. Sollicitatie Formulier
**Locatie**: `/werken-bij`
- ✉️ Notificatie naar HR team
- ✉️ Bevestiging naar sollicitant

### 3. Offerte Aanvragen
**Locatie**: `/diensten`, `/calculator`
- ✉️ Notificatie naar sales team
- ✉️ Bevestiging naar klant met geschatte timeline

### 4. Newsletter
**Locatie**: Footer op alle pagina's
- ✉️ Welkom email naar nieuwe subscribers

---

## 🚀 Setup Instructies

### Stap 1: Maak een Resend Account

1. Ga naar **https://resend.com**
2. Klik op **"Sign Up"**
3. Gebruik je **work@workflo.nl** email adres
4. Verifieer je email

### Stap 2: Voeg je Domein Toe

1. Log in op Resend dashboard
2. Ga naar **"Domains"** in het menu
3. Klik op **"Add Domain"**
4. Voer **workflo.nl** in
5. Kopieer de DNS records die Resend geeft

### Stap 3: Configureer DNS Records

Voeg deze DNS records toe bij je domain provider (bijv. TransIP, Byte, etc.):

```
Type: TXT
Name: _resend
Value: [waarde die Resend geeft]

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.eu-central-1.amazonses.com

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

**DKIM Records** (voor betere deliverability):
```
Type: CNAME
Name: resend._domainkey
Value: [waarde die Resend geeft]
```

### Stap 4: Genereer API Key

1. Ga naar **"API Keys"** in Resend dashboard
2. Klik op **"Create API Key"**
3. Geef het een naam: **"Workflo Website Production"**
4. Kies permissions: **"Full access"** (voor productie)
5. Kopieer de API key (begint met `re_`)

⚠️ **BELANGRIJK**: Bewaar deze key veilig! Hij wordt maar 1x getoond.

### Stap 5: Voeg API Key Toe aan .env.local

Open `.env.local` en vervang de placeholder:

```bash
# Voor development (localhost)
RESEND_API_KEY=re_jouw_echte_api_key_hier
```

### Stap 6: Restart Development Server

```bash
# Stop de huidige server (Ctrl+C)
npm run dev
```

---

## ✅ Test de Email Functionaliteit

### Test 1: Contact Formulier

1. Ga naar **http://localhost:3000/contact**
2. Vul het formulier in met echte gegevens
3. Klik **"Verstuur bericht"**
4. Check console voor logs:
   ```
   Contact form email sent successfully: [message-id]
   ```
5. Check je inbox (info@workflo.nl) voor de notificatie
6. Check de test email inbox voor bevestiging

### Test 2: API Health Check

Open in browser of curl:
```bash
curl http://localhost:3000/api/contact
```

Response moet zijn:
```json
{
  "message": "Contact API is active",
  "timestamp": "2025-11-13T...",
  "services": {
    "email": true,    // ✅ Moet TRUE zijn!
    "hubspot": true
  }
}
```

Als `"email": false`, dan is de API key niet correct ingesteld.

---

## 🔍 Troubleshooting

### Probleem 1: "Email service not available"

**Oorzaak**: Resend API key niet gevonden of incorrect

**Oplossing**:
1. Check of `.env.local` de `RESEND_API_KEY` heeft
2. Verificeer dat de key begint met `re_`
3. Restart development server
4. Check console voor errors

### Probleem 2: "From address not verified"

**Oorzaak**: Domein niet geverifieerd in Resend

**Oplossing**:
1. Log in op Resend dashboard
2. Ga naar **Domains**
3. Check of `workflo.nl` status **"Verified"** is
4. Zo niet, check DNS records bij je domain provider
5. DNS propagatie kan 24-48 uur duren

### Probleem 3: Emails komen in spam

**Oorzaak**: DKIM/SPF records niet correct

**Oplossing**:
1. Verify alle DNS records in Resend dashboard
2. Check SPF record: `v=spf1 include:amazonses.com ~all`
3. Verify DKIM records (CNAME)
4. Test met https://www.mail-tester.com
5. Warmup period: Verstuur eerst kleine aantallen

### Probleem 4: Rate limit exceeded

**Oorzaak**: Gratis tier limiet bereikt (100/dag)

**Oplossing**:
1. Check usage in Resend dashboard
2. Upgrade naar paid plan ($20/maand voor 50,000 emails)
3. Of wacht tot volgende dag (limiet reset)

---

## 📊 Email Templates

Alle email templates zijn volledig responsive en professioneel vormgegeven:

### Kenmerken:
- ✅ **Workflo branding** (geel #f2f400 accent)
- ✅ **Responsive HTML** (mobile-friendly)
- ✅ **Plain text fallback**
- ✅ **Tracking pixels** (optioneel)
- ✅ **Reply-to** correct ingesteld

### Template Bestanden:
Zie: `lib/services/email-service.ts`

Functies:
- `generateContactFormHtml()` - Contact notificatie
- `generateConfirmationHtml()` - Klant bevestiging
- `generateQuoteRequestHtml()` - Offerte aanvraag
- `generateQuoteConfirmationHtml()` - Offerte bevestiging

---

## 💰 Pricing

### Free Tier
- **100 emails per dag**
- **3,000 emails per maand**
- **Alle features inbegrepen**
- **Ideaal voor development en kleine websites**

### Pro Plan ($20/maand)
- **50,000 emails per maand**
- **Dedicated IP** (optioneel)
- **Priority support**
- **Advanced analytics**

### Voor Workflo:
Met gemiddeld **~50 contactverzoeken/maand**:
- Free tier is **ruim voldoende** ✅
- Upgrade pas nodig bij > 100 leads/dag

---

## 🔐 Security Best Practices

### API Key Management

1. **Development (.env.local)**:
   ```bash
   RESEND_API_KEY=re_development_key_hier
   ```

2. **Production (Vercel)**:
   - Ga naar Vercel dashboard
   - Project Settings → Environment Variables
   - Voeg `RESEND_API_KEY` toe als **Secret**
   - Herstart deployment

3. **NOOIT commit .env.local naar Git!**
   - Al in `.gitignore` gezet
   - Gebruik `.env.example` voor template

### From Address
Altijd gebruik maken van:
```typescript
from: 'noreply@workflo.nl'
replyTo: 'info@workflo.nl'
```

Dit voorkomt spam en zorgt voor goede deliverability.

---

## 📈 Monitoring

### Resend Dashboard
Monitor deze metrics:
- **Sent**: Totaal verzonden emails
- **Delivered**: Succesvol afgeleverd
- **Bounced**: Hard/soft bounces
- **Complained**: Spam complaints
- **Opened**: Open rate (optioneel tracking)

### Logs
Check development console voor:
```
[HubSpot Form] ...
Email service initialized successfully
Contact form email sent successfully: msg_xxx
```

---

## 🎯 Production Deployment

### Voor Vercel Deployment:

1. **Environment Variables toevoegen**:
   ```bash
   RESEND_API_KEY=re_production_key_hier
   ```

2. **Domain Verification**:
   - Verify `workflo.nl` in Resend
   - Check DNS records propagatie
   - Test met staging environment eerst

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Add Resend email integration"
   git push origin main
   ```

4. **Post-Deployment Test**:
   - Test contact form op productie
   - Check Resend dashboard voor delivery
   - Monitor voor eerste 24 uur

---

## 📚 Documentatie Links

- **Resend Docs**: https://resend.com/docs
- **API Reference**: https://resend.com/docs/api-reference
- **React Email**: https://react.email (voor advanced templates)
- **DNS Setup**: https://resend.com/docs/dashboard/domains/introduction

---

## ✅ Checklist

Voordat je live gaat:

- [ ] Resend account aangemaakt
- [ ] Domain `workflo.nl` toegevoegd aan Resend
- [ ] DNS records geconfigureerd (SPF, DKIM, MX)
- [ ] Domain status **"Verified"** in Resend
- [ ] API key gegenereerd
- [ ] `RESEND_API_KEY` in `.env.local` gezet
- [ ] Development server herstart
- [ ] Contact form getest (http://localhost:3000/contact)
- [ ] Email ontvangen in info@workflo.nl inbox
- [ ] Bevestiging email ontvangen in test inbox
- [ ] API health check returnt `"email": true`
- [ ] Production API key gegenereerd (apart van development)
- [ ] Production API key in Vercel environment variables
- [ ] Production deployment getest

---

## 🎉 Na Setup

Zodra alles werkt:

✅ **Contact formulieren** versturen emails
✅ **Sollicitaties** worden automatisch verstuurd
✅ **Offerte aanvragen** gaan naar sales team
✅ **Newsletter** subscriptions werken
✅ **Klanten** krijgen bevestigingen

**Je website is nu volledig functioneel!** 🚀

---

*Setup guide aangemaakt: 2025-11-13*
*Voor vragen: Check Resend docs of dev console logs*
