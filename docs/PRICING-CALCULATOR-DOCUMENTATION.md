# Pricing Calculator Documentation

## Overzicht

De Workflo IT Support Pricing Calculator is een interactieve wizard die klanten helpt bij het berekenen van hun maandelijkse IT-kosten. De calculator is gebouwd met React, TypeScript en Framer Motion voor een soepele gebruikerservaring.

## Component Locatie

`/components/pricing/pricing-calculator-new.tsx`

## Architectuur

### 1. Wizard Structuur (3 stappen)

#### Stap 1: Bedrijfsinformatie
- **Aantal medewerkers** (1-100): Slider met visuele schaal
- **Aantal servers** (0-20): Slider met visuele schaal
- **Automatische berekening** van geschatte support uren:
  - Medewerkers: 1.15 uur per medewerker per maand
  - Servers: 5 uur per server per maand
  - Gebaseerd op branche gemiddelden (130 FTE = 150 uur/maand)

#### Stap 2: Support Voorkeuren
- **Support Type**:
  - Remote Support: €60/medewerker + €30/server
  - On-site Support: €90/medewerker + €45/server
  
- **Contract Type**:
  - Maandelijks: Flexibel opzegbaar, standaard tarief
  - Jaarcontract: 10% korting op totale kosten
  
- **Microsoft 365 Licenties** (NIEUW):
  - Business Basic: €5.60/maand - Email, OneDrive, Teams (web-only)
  - Business Standard: €11.50/maand - Alles van Basic + desktop apps
  - Business Premium: €20.60/maand - Alles van Standard + geavanceerde beveiliging
  - Incrementele knoppen (+/-) voor het selecteren van aantal licenties

#### Stap 3: Prijsoverzicht
- **Twee weergaven**:
  1. "Jouw Advies": Gedetailleerde Fixed-Fee aanbeveling
  2. "Alle Opties": Vergelijking tussen Ad-hoc, Pre-Paid en Fixed-Fee

## Prijsmodellen

### 1. Ad-hoc Model
```javascript
- Basis uurtarief: €110/uur
- After-hours tarief: 150% (€165/uur)
- Geschat after-hours percentage: 10%
- Risico: Hoog (onvoorspelbare kosten)
```

### 2. Pre-Paid Model
```javascript
- 10 uren pakket: €1000 (€100/uur)
- 20 uren pakket: €1800 (€90/uur)
- Automatisch berekent aantal benodigde pakketten
- Risico: Gemiddeld
```

### 3. Fixed-Fee Model
```javascript
- Remote: €60/medewerker + €30/server + M365 licenties
- On-site: €90/medewerker + €45/server + M365 licenties
- Jaarcontract korting: 10%
- Inclusief: Onbeperkte support, 24/7 monitoring, proactief onderhoud
- Risico: Geen
```

## State Management

### Calculator State
```typescript
const [employees, setEmployees] = useState([10])
const [servers, setServers] = useState([2])
const [supportType, setSupportType] = useState<'remote' | 'onsite'>('remote')
const [commitmentType, setCommitmentType] = useState<'monthly' | 'yearly'>('monthly')
const [businessBasicLicenses, setBusinessBasicLicenses] = useState([0])
const [businessStandardLicenses, setBusinessStandardLicenses] = useState([0])
const [businessPremiumLicenses, setBusinessPremiumLicenses] = useState([0])
```

### Wizard Navigation
```typescript
const [currentStep, setCurrentStep] = useState(1)
const [isAnimating, setIsAnimating] = useState(false)
const [showComparison, setShowComparison] = useState(false)
```

## Berekeningen

### Support Uren Schatting
```typescript
const estimatedHoursPerMonth = Math.round(
  (employeeCount * 1.15) + (serverCount * 5)
)
```

### Microsoft 365 Kosten
```typescript
const m365MonthlyCost = 
  (basicLicenses * 5.60) + 
  (standardLicenses * 11.50) + 
  (premiumLicenses * 20.60)
```

### Fixed-Fee Totaal
```typescript
const monthlyStandard = 
  (employeeCount * pricePerUser) + 
  (serverCount * pricePerServer) + 
  m365MonthlyCost

const monthlyPrice = monthlyStandard * (1 - yearlyDiscount)
```

## UI Features

### Animaties (Framer Motion)
- Stap transitie animaties met slide effect
- Hover en tap animaties op knoppen
- Schaal animaties bij prijsweergave
- Progress bar animatie

### Visuele Feedback
- Real-time prijsupdate bij elke wijziging
- Visuele schaal indicatoren bij sliders
- Kleurgecodeerde risico badges
- Besparingspercentage highlights
- Microsoft 365 kostenoverzicht

### Responsive Design
- Mobile-first approach
- Grid layouts voor grotere schermen
- Touch-friendly controls

## Gebruikersflow

1. **Start**: Gebruiker ziet stap 1 met bedrijfsinformatie
2. **Configuratie**: Sliders voor medewerkers/servers
3. **Support keuze**: Remote vs On-site, Maandelijks vs Jaarlijks
4. **M365 Licenties**: Optioneel toevoegen van Microsoft 365
5. **Resultaat**: Persoonlijke offerte met:
   - Aanbevolen Fixed-Fee oplossing
   - Kostenoverzicht breakdown
   - Besparing t.o.v. Ad-hoc
   - CTA naar contact pagina

## Technische Highlights

### Component Structuur
- Single-file component voor eenvoudige maintainability
- Gebruik van Shadcn/ui componenten
- TypeScript voor type safety
- Tailwind CSS voor styling

### Performance Optimalisaties
- Lazy loading van animaties
- Efficiënte state updates
- Minimale re-renders door goede state structuur

### Accessibility
- Keyboard navigatie support
- ARIA labels waar nodig
- Focus management tussen stappen
- Contrast ratio compliance

## Toekomstige Verbeteringen

1. **Data persistentie**: LocalStorage voor tijdelijk opslaan van keuzes
2. **Export functie**: PDF generatie van offerte
3. **Email integratie**: Direct offerte versturen
4. **A/B testing**: Verschillende prijsweergaven testen
5. **Analytics**: Tracking van gebruikersinteracties
6. **Extra diensten**: Backup oplossingen, security packages

## Dependencies

- React 19.1.0
- Framer Motion (animaties)
- Lucide React (iconen)
- Shadcn/ui componenten
- Tailwind CSS

## Testing Checklist

- [ ] Slider functionaliteit op alle devices
- [ ] Prijsberekeningen accuraat
- [ ] Animaties smooth op alle browsers
- [ ] M365 licentie calculator werkt correct
- [ ] Jaarcontract korting wordt goed toegepast
- [ ] Responsive design op mobile/tablet/desktop
- [ ] CTA links werken naar contact pagina

## Contact

Voor vragen of verbeteringen aan de calculator, neem contact op met het development team.