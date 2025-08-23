export interface Question {
  id: number
  question: string
  questionEN: string
  options: string[]
  optionsEN: string[]
  next: (number | string)[]
  type: ('positive' | 'negative' | 'neutral')[]
  category?: 'support' | 'communication' | 'quality' | 'cost' | 'reliability'
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Zijn jullie tevreden met jullie huidige IT-ondersteuning?",
    questionEN: "Are you satisfied with your current IT support?",
    options: ["Ja, heel tevreden", "Kan beter", "Nee, ontevreden"],
    optionsEN: ["Yes, very satisfied", "Could be better", "No, unsatisfied"],
    next: [2, 3, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  },
  {
    id: 2,
    question: "Hoe snel wordt er gereageerd op IT-problemen?",
    questionEN: "How quickly are IT problems responded to?",
    options: ["Binnen een uur", "Binnen een dag", "Duurt te lang"],
    optionsEN: ["Within an hour", "Within a day", "Takes too long"],
    next: [4, 5, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  },
  {
    id: 3,
    question: "Wat zijn de grootste IT-uitdagingen in je bedrijf?",
    questionEN: "What are the biggest IT challenges in your company?",
    options: ["Beveiliging", "Prestaties", "Kosten", "Betrouwbaarheid"],
    optionsEN: ["Security", "Performance", "Costs", "Reliability"],
    next: [6, 7, 8, 9],
    type: ["neutral", "neutral", "neutral", "neutral"],
    category: "quality"
  },
  {
    id: 4,
    question: "Hoe beoordeel je de expertise van je IT-partner?",
    questionEN: "How do you rate your IT partner's expertise?",
    options: ["Uitstekend", "Voldoende", "Onvoldoende"],
    optionsEN: ["Excellent", "Sufficient", "Insufficient"],
    next: [10, 11, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 5,
    question: "Worden problemen meestal in één keer opgelost?",
    questionEN: "Are problems usually solved in one go?",
    options: ["Altijd", "Meestal wel", "Vaak niet"],
    optionsEN: ["Always", "Usually", "Often not"],
    next: [10, 11, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 6,
    question: "Hoe belangrijk is cybersecurity voor je bedrijf?",
    questionEN: "How important is cybersecurity for your business?",
    options: ["Zeer belangrijk", "Belangrijk", "Niet zo belangrijk"],
    optionsEN: ["Very important", "Important", "Not so important"],
    next: [12, 13, 14],
    type: ["neutral", "neutral", "neutral"],
    category: "reliability"
  },
  {
    id: 7,
    question: "Ervaar je vaak prestatieproblemen met je systemen?",
    questionEN: "Do you often experience performance issues with your systems?",
    options: ["Nooit", "Soms", "Regelmatig"],
    optionsEN: ["Never", "Sometimes", "Regularly"],
    next: [15, 16, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 8,
    question: "Vind je dat je te veel betaalt voor IT-diensten?",
    questionEN: "Do you think you pay too much for IT services?",
    options: ["Nee, redelijk", "Misschien", "Ja, te duur"],
    optionsEN: ["No, reasonable", "Maybe", "Yes, too expensive"],
    next: [17, 18, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "cost"
  },
  {
    id: 9,
    question: "Hoe vaak vallen je systemen uit?",
    questionEN: "How often do your systems fail?",
    options: ["Nooit", "Zelden", "Te vaak"],
    optionsEN: ["Never", "Rarely", "Too often"],
    next: [19, 20, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 10,
    question: "Krijg je proactief advies over IT-verbeteringen?",
    questionEN: "Do you receive proactive advice about IT improvements?",
    options: ["Ja, regelmatig", "Soms", "Nooit"],
    optionsEN: ["Yes, regularly", "Sometimes", "Never"],
    next: ["satisfied", 21, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "communication"
  },
  {
    id: 11,
    question: "Is je IT-partner bereikbaar buiten kantooruren?",
    questionEN: "Is your IT partner available outside office hours?",
    options: ["24/7 bereikbaar", "Beperkt", "Alleen kantooruren"],
    optionsEN: ["24/7 available", "Limited", "Office hours only"],
    next: [22, 23, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  },
  {
    id: 12,
    question: "Heb je een goed beveiligingsplan?",
    questionEN: "Do you have a good security plan?",
    options: ["Ja, uitgebreid", "Basis beveiliging", "Niet echt"],
    optionsEN: ["Yes, comprehensive", "Basic security", "Not really"],
    next: ["satisfied", 24, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 13,
    question: "Worden je medewerkers getraind in cybersecurity?",
    questionEN: "Are your employees trained in cybersecurity?",
    options: ["Ja, regelmatig", "Een keer", "Nooit"],
    optionsEN: ["Yes, regularly", "Once", "Never"],
    next: ["satisfied", 25, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 14,
    question: "Maak je regelmatig backups van je data?",
    questionEN: "Do you regularly backup your data?",
    options: ["Automatisch dagelijks", "Handmatig", "Zelden"],
    optionsEN: ["Automatic daily", "Manual", "Rarely"],
    next: ["satisfied", 26, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 15,
    question: "Zijn je systemen up-to-date?",
    questionEN: "Are your systems up-to-date?",
    options: ["Altijd", "Meestal", "Weet ik niet"],
    optionsEN: ["Always", "Usually", "Don't know"],
    next: ["satisfied", 27, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 16,
    question: "Heb je voldoende IT-capaciteit voor groei?",
    questionEN: "Do you have sufficient IT capacity for growth?",
    options: ["Ruim voldoende", "Net genoeg", "Te weinig"],
    optionsEN: ["More than enough", "Just enough", "Too little"],
    next: ["satisfied", 28, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 17,
    question: "Krijg je transparante facturen?",
    questionEN: "Do you receive transparent invoices?",
    options: ["Zeer duidelijk", "Redelijk", "Onduidelijk"],
    optionsEN: ["Very clear", "Reasonable", "Unclear"],
    next: ["satisfied", 29, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "cost"
  },
  {
    id: 18,
    question: "Betaal je voor diensten die je niet gebruikt?",
    questionEN: "Do you pay for services you don't use?",
    options: ["Nee", "Misschien", "Ja"],
    optionsEN: ["No", "Maybe", "Yes"],
    next: ["satisfied", 30, "contact"],
    type: ["positive", "neutral", "negative"],
    category: "cost"
  },
  {
    id: 19,
    question: "Heb je een disaster recovery plan?",
    questionEN: "Do you have a disaster recovery plan?",
    options: ["Ja, getest", "Ja, maar niet getest", "Nee"],
    optionsEN: ["Yes, tested", "Yes, but not tested", "No"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 20,
    question: "Hoe snel herstel je van een storing?",
    questionEN: "How quickly do you recover from an outage?",
    options: ["< 1 uur", "< 4 uur", "> 4 uur"],
    optionsEN: ["< 1 hour", "< 4 hours", "> 4 hours"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 21,
    question: "Ben je over het algemeen tevreden met je huidige IT-situatie?",
    questionEN: "Are you generally satisfied with your current IT situation?",
    options: ["Ja", "Gaat wel", "Nee"],
    optionsEN: ["Yes", "It's okay", "No"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  },
  {
    id: 22,
    question: "Vind je dat je voldoende IT-ondersteuning krijgt voor de prijs?",
    questionEN: "Do you feel you get adequate IT support for the price?",
    options: ["Ja, goede waarde", "Kan beter", "Nee, te weinig"],
    optionsEN: ["Yes, good value", "Could be better", "No, too little"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "cost"
  },
  {
    id: 23,
    question: "Wordt er snel gereageerd op urgente problemen?",
    questionEN: "Are urgent problems responded to quickly?",
    options: ["Altijd", "Meestal", "Te langzaam"],
    optionsEN: ["Always", "Usually", "Too slow"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  },
  {
    id: 24,
    question: "Heb je vertrouwen in je huidige beveiligingsmaatregelen?",
    questionEN: "Do you trust your current security measures?",
    options: ["Volledig vertrouwen", "Redelijk", "Niet echt"],
    optionsEN: ["Complete trust", "Reasonable", "Not really"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 25,
    question: "Weten je medewerkers hoe ze veilig moeten werken?",
    questionEN: "Do your employees know how to work securely?",
    options: ["Ja, goed getraind", "Basis kennis", "Nee"],
    optionsEN: ["Yes, well trained", "Basic knowledge", "No"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 26,
    question: "Kun je je data snel terugvinden als je het nodig hebt?",
    questionEN: "Can you quickly retrieve your data when needed?",
    options: ["Altijd", "Meestal wel", "Vaak niet"],
    optionsEN: ["Always", "Usually", "Often not"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 27,
    question: "Werken al je programma's goed samen?",
    questionEN: "Do all your programs work well together?",
    options: ["Perfect", "Redelijk", "Problemen"],
    optionsEN: ["Perfect", "Reasonable", "Problems"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "quality"
  },
  {
    id: 28,
    question: "Kun je je IT-systemen makkelijk uitbreiden?",
    questionEN: "Can you easily expand your IT systems?",
    options: ["Ja, flexibel", "Met moeite", "Nee"],
    optionsEN: ["Yes, flexible", "With difficulty", "No"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "reliability"
  },
  {
    id: 29,
    question: "Krijg je duidelijke uitleg over IT-kosten?",
    questionEN: "Do you get clear explanations about IT costs?",
    options: ["Altijd", "Soms", "Nooit"],
    optionsEN: ["Always", "Sometimes", "Never"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "cost"
  },
  {
    id: 30,
    question: "Zou je je huidige IT-ondersteuning aanbevelen?",
    questionEN: "Would you recommend your current IT support?",
    options: ["Zeker", "Misschien", "Nee"],
    optionsEN: ["Definitely", "Maybe", "No"],
    next: ["satisfied", "satisfied", "contact"],
    type: ["positive", "neutral", "negative"],
    category: "support"
  }
]

export interface QuestionnaireResult {
  score: number
  category: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  title: string
  titleEN: string
  description: string
  descriptionEN: string
  recommendations: string[]
  recommendationsEN: string[]
  ctaText: string
  ctaTextEN: string
}

export const calculateResult = (answers: number[]): QuestionnaireResult => {
  // Calculate score based on answers
  const score = answers.reduce((total, answer) => total + answer, 0)
  const maxScore = answers.length * 2 // Maximum 2 points per answer
  const percentage = (score / maxScore) * 100

  if (percentage >= 80) {
    return {
      score: percentage,
      category: 'excellent',
      title: 'Uitstekende IT-gezondheid!',
      titleEN: 'Excellent IT Health!',
      description: 'Je IT-infrastructuur is in uitstekende staat. Je hebt de juiste systemen en ondersteuning.',
      descriptionEN: 'Your IT infrastructure is in excellent condition. You have the right systems and support.',
      recommendations: [
        'Blijf je systemen regelmatig updaten',
        'Overweeg geavanceerde security maatregelen',
        'Plan voor toekomstige groei'
      ],
      recommendationsEN: [
        'Keep your systems regularly updated',
        'Consider advanced security measures',
        'Plan for future growth'
      ],
      ctaText: 'Ontdek onze geavanceerde diensten',
      ctaTextEN: 'Discover our advanced services'
    }
  } else if (percentage >= 60) {
    return {
      score: percentage,
      category: 'good',
      title: 'Goede basis, maar ruimte voor verbetering',
      titleEN: 'Good foundation, but room for improvement',
      description: 'Je IT functioneert redelijk, maar er zijn kansen om efficiëntie en beveiliging te verbeteren.',
      descriptionEN: 'Your IT functions reasonably well, but there are opportunities to improve efficiency and security.',
      recommendations: [
        'Verbeter response tijden',
        'Implementeer proactief onderhoud',
        'Optimaliseer je IT-kosten'
      ],
      recommendationsEN: [
        'Improve response times',
        'Implement proactive maintenance',
        'Optimize your IT costs'
      ],
      ctaText: 'Vraag een gratis IT-scan aan',
      ctaTextEN: 'Request a free IT scan'
    }
  } else if (percentage >= 40) {
    return {
      score: percentage,
      category: 'needs-improvement',
      title: 'Je IT heeft aandacht nodig',
      titleEN: 'Your IT needs attention',
      description: 'Er zijn verschillende gebieden waar je IT-infrastructuur verbetering nodig heeft.',
      descriptionEN: 'There are several areas where your IT infrastructure needs improvement.',
      recommendations: [
        'Verbeter je cybersecurity direct',
        'Implementeer backup procedures',
        'Overweeg professionele IT-ondersteuning'
      ],
      recommendationsEN: [
        'Improve your cybersecurity immediately',
        'Implement backup procedures',
        'Consider professional IT support'
      ],
      ctaText: 'Laat ons u helpen',
      ctaTextEN: 'Let us help you'
    }
  } else {
    return {
      score: percentage,
      category: 'critical',
      title: 'Kritieke IT-situatie',
      titleEN: 'Critical IT situation',
      description: 'Je IT-infrastructuur heeft dringend professionele aandacht nodig om risico\'s te minimaliseren.',
      descriptionEN: 'Your IT infrastructure urgently needs professional attention to minimize risks.',
      recommendations: [
        'Neem direct contact op voor hulp',
        'Beveilig je kritieke data',
        'Implementeer een noodplan'
      ],
      recommendationsEN: [
        'Contact us immediately for help',
        'Secure your critical data',
        'Implement an emergency plan'
      ],
      ctaText: 'Neem vandaag nog contact op',
      ctaTextEN: 'Contact us today'
    }
  }
}