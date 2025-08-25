# Workflo IT Services Platform - API Documentatie

## Authenticatie

### Login
- **Endpoint**: `/api/auth/login`
- **Methode**: POST
- **Beschrijving**: Authenticatie voor gebruikers

#### Request Body
```json
{
    "email": "string",
    "password": "string"
}
```

#### Responses
- `200 OK`: Succesvolle login
- `401 Unauthorized`: Ongeldige credentials
- `429 Too Many Requests`: Rate limit bereikt

## Services API

### Diensten Ophalen
- **Endpoint**: `/api/services`
- **Methode**: GET
- **Beschrijving**: Lijst van alle IT-diensten

#### Query Parameters
- `category`: Filter op dienstcategorie
- `limit`: Aantal resultaten per pagina

#### Response
```json
{
    "services": [
        {
            "id": "string",
            "title": "Managed IT Services",
            "description": "string",
            "category": "Beheer",
            "pricing": {
                "basic": 500,
                "advanced": 1000
            }
        }
    ],
    "total": "number"
}
```

### Specifieke Dienst
- **Endpoint**: `/api/services/[slug]`
- **Methode**: GET
- **Beschrijving**: Details van een specifieke dienst

## Offerte Aanvraag

### Quote Indienen
- **Endpoint**: `/api/quote`
- **Methode**: POST
- **Beschrijving**: Offerte aanvraag indienen

#### Request Body
```json
{
    "name": "string",
    "email": "string",
    "company": "string",
    "services": ["string"],
    "details": "string"
}
```

## Veelgestelde Vragen

### FAQ Ophalen
- **Endpoint**: `/api/faq`
- **Methode**: GET
- **Beschrijving**: Verzameling veelgestelde vragen

## Contactformulier

### Bericht Verzenden
- **Endpoint**: `/api/contact`
- **Methode**: POST
- **Beschrijving**: Contactformulier verzenden

#### Request Body
```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string"
}
```

## Authenticatie & Beveiliging

### Rate Limiting
- Maximaal 100 requests per uur per IP
- API-sleutel vereist voor bepaalde endpoints

### Verificatie
- JWT-tokens voor authenticatie
- Role-Based Access Control (RBAC)

## Error Handling

### Standaard Foutcodes
- `400 Bad Request`: Ongeldige parameters
- `401 Unauthorized`: Authenticatie mislukt
- `403 Forbidden`: Geen rechten
- `404 Not Found`: Resource niet gevonden
- `429 Too Many Requests`: Rate limit overschreden
- `500 Internal Server Error`: Onverwachte serverfout

## Voorbeelden

### cURL Voorbeeld
```bash
curl -X POST https://workflo.it/api/quote \
     -H "Content-Type: application/json" \
     -d '{
         "name": "Klant Naam",
         "email": "klant@bedrijf.nl",
         "services": ["Managed IT", "Cybersecurity"],
         "details": "Offerte aanvraag voor IT-ondersteuning"
     }'
```

## Versioning
- Huidige API Versie: v1.2.0
- Backward compatibility gegarandeerd
- Deprecated endpoints worden 3 maanden van tevoren aangekondigd

## Ondersteunde Talen
- Nederlands
- Engels

**Laatste Update**: 25 augustus 2025