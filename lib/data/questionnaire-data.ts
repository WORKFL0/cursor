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

export interface DetailedAnswer {
  questionId: number
  answerValue: number
  question: Question
}

// Mapping of problem areas to personalized recommendations
const personalizedRecommendations = {
  slowResponse: {
    nl: "Workflo biedt snelle response binnen 4 uur, vaak binnen 30 minuten. Onze 24/7 helpdesk zorgt ervoor dat je nooit lang hoeft te wachten.",
    en: "Workflo provides fast response within 4 hours, often within 30 minutes. Our 24/7 helpdesk ensures you never have to wait long."
  },
  lackExpertise: {
    nl: "Onze Microsoft-gecertificeerde experts hebben jarenlange ervaring. Wij lossen problemen meteen goed op, zonder gezeur over uitleg.",
    en: "Our Microsoft-certified experts have years of experience. We solve problems correctly immediately, without hassle about explanations."
  },
  securityConcerns: {
    nl: "Workflo's cybersecurity-specialisten beschermen je bedrijf met enterprise-grade beveiliging, inclusief 24/7 monitoring en proactieve dreigingsdetectie.",
    en: "Workflo's cybersecurity specialists protect your business with enterprise-grade security, including 24/7 monitoring and proactive threat detection."
  },
  reliabilityIssues: {
    nl: "Met Workflo's proactieve monitoring en onderhoud voorkom je systeemstoringen. Onze uptime-garantie van 99.9% houdt jouw bedrijf draaiende.",
    en: "With Workflo's proactive monitoring and maintenance, you prevent system failures. Our 99.9% uptime guarantee keeps your business running."
  },
  highCosts: {
    nl: "Workflo biedt transparante, voorspelbare IT-kosten zonder verrassingen. Bespaar tot 30% op je IT-uitgaven met onze efficiënte all-in-one aanpak.",
    en: "Workflo offers transparent, predictable IT costs without surprises. Save up to 30% on your IT expenses with our efficient all-in-one approach."
  },
  poorCommunication: {
    nl: "Bij Workflo krijg je een persoonlijke IT-manager die proactief communiceert en je altijd op de hoogte houdt van je IT-status.",
    en: "At Workflo, you get a personal IT manager who communicates proactively and always keeps you informed of your IT status."
  },
  limitedSupport: {
    nl: "Workflo biedt complete 24/7 ondersteuning, inclusief remote support, on-site service en emergency response wanneer je het nodig hebt.",
    en: "Workflo provides complete 24/7 support, including remote support, on-site service and emergency response when you need it."
  }
}

// Backward compatibility function for simple answers
export const calculateResultFromAnswers = (answers: number[]): QuestionnaireResult => {
  // Convert simple answers to detailed answers with minimal info
  const detailedAnswers: DetailedAnswer[] = answers.map((answerValue, index) => ({
    questionId: index + 1, // Simple mapping
    answerValue,
    question: questions[index] || questions[0] // Fallback
  }))
  return calculateResult(detailedAnswers)
}

export const calculateResult = (detailedAnswers: DetailedAnswer[]): QuestionnaireResult => {
  // Calculate score based on answers
  const answers = detailedAnswers.map(da => da.answerValue)
  const score = answers.reduce((total, answer) => total + answer, 0)
  const maxScore = answers.length * 2 // Maximum 2 points per answer
  const percentage = (score / maxScore) * 100

  // Identify problem areas from negative answers (value 0)
  const problemAreas = new Set<string>()
  const specificProblems: string[] = []
  const specificProblemsEN: string[] = []

  detailedAnswers.forEach(({ answerValue, question, questionId }) => {
    if (answerValue === 0) { // Negative answer
      // Map specific questions to problem categories
      switch (questionId) {
        case 1: // Not satisfied with IT support
          problemAreas.add('limitedSupport')
          specificProblems.push("Je bent ontevreden met je huidige IT-ondersteuning")
          specificProblemsEN.push("You are dissatisfied with your current IT support")
          break
        case 2: // Slow response to problems
          problemAreas.add('slowResponse')
          specificProblems.push("IT-problemen worden te langzaam opgelost")
          specificProblemsEN.push("IT problems are solved too slowly")
          break
        case 4: // Insufficient expertise
        case 25: // Employees don't know how to work securely
          problemAreas.add('lackExpertise')
          specificProblems.push("Je IT-partner heeft onvoldoende expertise")
          specificProblemsEN.push("Your IT partner has insufficient expertise")
          break
        case 5: // Problems not solved in one go
        case 23: // Urgent problems not responded to quickly
          problemAreas.add('slowResponse')
          break
        case 6: // Security is very important
        case 12: // No good security plan
        case 13: // No cybersecurity training
        case 24: // Don't trust security measures
          problemAreas.add('securityConcerns')
          specificProblems.push("Je hebt zorgen over cybersecurity")
          specificProblemsEN.push("You have concerns about cybersecurity")
          break
        case 7: // Regular performance issues
        case 9: // Systems fail too often
        case 16: // Too little IT capacity for growth
        case 27: // Programs don't work well together
        case 28: // Can't easily expand IT systems
          problemAreas.add('reliabilityIssues')
          specificProblems.push("Je systemen zijn niet betrouwbaar genoeg")
          specificProblemsEN.push("Your systems are not reliable enough")
          break
        case 8: // Too expensive IT services
        case 18: // Pay for unused services
        case 22: // Don't get adequate support for the price
        case 29: // No clear cost explanations
          problemAreas.add('highCosts')
          specificProblems.push("Je IT-kosten zijn te hoog of onduidelijk")
          specificProblemsEN.push("Your IT costs are too high or unclear")
          break
        case 10: // No proactive advice
        case 11: // Not available outside office hours
        case 30: // Wouldn't recommend current IT support
          problemAreas.add('poorCommunication')
          specificProblems.push("Je mist proactieve communicatie van je IT-partner")
          specificProblemsEN.push("You miss proactive communication from your IT partner")
          break
        case 14: // Rarely backup data
        case 19: // No disaster recovery plan
        case 20: // Slow recovery from outages
        case 26: // Can't quickly retrieve data
          problemAreas.add('reliabilityIssues')
          specificProblems.push("Je data en backups zijn niet op orde")
          specificProblemsEN.push("Your data and backups are not in order")
          break
      }
    }
  })

  // Generate personalized recommendations based on identified problems
  const personalizedRecs: string[] = []
  const personalizedRecsEN: string[] = []

  // Always start with the main message
  const mainMessage = "Neem zo snel mogelijk contact met ons op om je IT naar een hoger niveau te tillen, zodat jij je kunt focussen op andere, belangrijkere zaken. Wij zorgen ervoor dat je IT op een hoger niveau komt."
  const mainMessageEN = "Take contact with us as soon as possible to elevate your IT to a higher level, so you can focus on other, more important matters. We ensure your IT reaches a higher level."

  personalizedRecs.push(mainMessage)
  personalizedRecsEN.push(mainMessageEN)

  // Add specific recommendations based on their problems
  problemAreas.forEach(area => {
    const rec = personalizedRecommendations[area as keyof typeof personalizedRecommendations]
    if (rec) {
      personalizedRecs.push(rec.nl)
      personalizedRecsEN.push(rec.en)
    }
  })

  // If no specific problems identified, add generic professional message
  if (problemAreas.size === 0) {
    personalizedRecs.push("Laat Workflo een gratis IT-health check uitvoeren om verborgen risico's en verbeterkansen te identificeren.")
    personalizedRecsEN.push("Let Workflo perform a free IT health check to identify hidden risks and improvement opportunities.")
  }

  // Determine category and messaging based on score and problems
  if (percentage >= 80 && problemAreas.size <= 1) {
    return {
      score: percentage,
      category: 'excellent',
      title: 'Goede IT-basis, maar Workflo kan je nog verder helpen!',
      titleEN: 'Good IT foundation, but Workflo can help you even further!',
      description: 'Je IT functioneert goed, maar er zijn altijd kansen om nog beter te presteren en toekomstbestendig te worden.',
      descriptionEN: 'Your IT functions well, but there are always opportunities to perform even better and become future-proof.',
      recommendations: personalizedRecs,
      recommendationsEN: personalizedRecsEN,
      ctaText: 'Ontdek hoe Workflo je kan helpen groeien',
      ctaTextEN: 'Discover how Workflo can help you grow'
    }
  } else if (percentage >= 60 || problemAreas.size <= 2) {
    return {
      score: percentage,
      category: 'good',
      title: 'Tijd om je IT naar het volgende niveau te tillen!',
      titleEN: 'Time to elevate your IT to the next level!',
      description: 'Je IT werkt, maar laat kansen liggen. Workflo kan deze gebieden direct verbeteren zodat jij je kunt focussen op je kernactiviteiten.',
      descriptionEN: 'Your IT works, but misses opportunities. Workflo can immediately improve these areas so you can focus on your core activities.',
      recommendations: personalizedRecs,
      recommendationsEN: personalizedRecsEN,
      ctaText: 'Laat Workflo je IT optimaliseren',
      ctaTextEN: 'Let Workflo optimize your IT'
    }
  } else if (percentage >= 40 || problemAreas.size <= 4) {
    return {
      score: percentage,
      category: 'needs-improvement',
      title: 'Je IT belemmert je bedrijfsvoering - Workflo lost dit op!',
      titleEN: 'Your IT hinders your business operations - Workflo solves this!',
      description: 'Meerdere IT-problemen houden je tegen. Stop met IT-frustraties en laat Workflo alles voor je regelen.',
      descriptionEN: 'Multiple IT problems are holding you back. Stop IT frustrations and let Workflo handle everything for you.',
      recommendations: personalizedRecs,
      recommendationsEN: personalizedRecsEN,
      ctaText: 'Stop IT-problemen - neem direct contact op',
      ctaTextEN: 'Stop IT problems - contact us immediately'
    }
  } else {
    return {
      score: percentage,
      category: 'critical',
      title: 'URGENT: Je IT is een risico voor je bedrijf!',
      titleEN: 'URGENT: Your IT is a risk to your business!',
      description: 'Je IT-situatie is kritiek en brengt je bedrijf in gevaar. Workflo kan deze crisis direct oplossen - elke dag wachten kost geld.',
      descriptionEN: 'Your IT situation is critical and puts your business at risk. Workflo can solve this crisis immediately - every day of waiting costs money.',
      recommendations: personalizedRecs,
      recommendationsEN: personalizedRecsEN,
      ctaText: 'SPOEDCONTACT - Bel nu voor hulp',
      ctaTextEN: 'EMERGENCY CONTACT - Call now for help'
    }
  }
}