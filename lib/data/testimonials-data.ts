export interface Testimonial {
  id: string
  name: string
  nameNL: string
  company: string
  role: string
  roleNL: string
  quote: string
  quoteNL: string
  rating: number
  image?: string
  featured?: boolean
  service?: string
  serviceNL?: string
  date: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Esther van der Plas',
    nameNL: 'Esther van der Plas',
    company: 'Workflo klant',
    role: 'Managing Director',
    roleNL: 'Managing Director',
    quote: 'Every business needs Workflo. They are the IT Masters. Fast, knowledgeable, to the point, down to earth, friendly and super cool! Workflo is the absolute it in IT!',
    quoteNL: 'Elk bedrijf heeft Workflo nodig. Zij zijn de IT Masters. Snel, deskundig, to the point, nuchter, vriendelijk en super cool! Workflo is het absolute it in IT!',
    rating: 5,
    featured: true,
    service: 'Managed IT Services',
    serviceNL: 'Beheerde IT-diensten',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Thijs Muller',
    nameNL: 'Thijs Muller',
    company: 'Workflo klant',
    role: 'CEO',
    roleNL: 'CEO',
    quote: 'Workflo is an extension and integral part of our team. Very involved, easily approachable, solution-oriented, creative and professional. Their integrated approach provides management of employee issues, workplaces and remote working to complex back office system challenges.',
    quoteNL: 'Workflo is een verlengstuk en integraal onderdeel van ons team. Zeer betrokken, makkelijk aanspreekbaar, oplossingsgericht, creatief en professioneel. Hun integrale aanpak voorziet in het management van werknemers vragen, werkplekken en remote working tot complexe back office systeem uitdagingen.',
    rating: 5,
    featured: true,
    service: 'Managed IT Services',
    serviceNL: 'Beheerde IT-diensten',
    date: '2024-02-20'
  },
  {
    id: '3',
    name: 'Patrick Beijl',
    nameNL: 'Patrick Beijl',
    company: 'Workflo klant',
    role: 'Commercial Director',
    roleNL: 'Commerciële Directeur',
    quote: 'Florian and his team are there to help. Whether it is about simple usability issues or the more serious stuff about network, servers, trustworthy backup systems and security. Workflo knows. They solve it instantly. With a smile.',
    quoteNL: 'Florian en zijn team staan klaar om te helpen. Of het nu gaat om eenvoudige bruikbaarheidsproblemen of de meer serieuze zaken zoals netwerk, servers, betrouwbare back-upsystemen en beveiliging. Workflo weet het. Ze lossen het direct op. Met een glimlach.',
    rating: 5,
    featured: true,
    service: 'Managed IT Services',
    serviceNL: 'Beheerde IT-diensten',
    date: '2024-03-10'
  }
]

export function getFeaturedTestimonials() {
  return testimonials.filter(t => t.featured)
}

export function getTestimonialsByService(service: string) {
  return testimonials.filter(t => t.service === service || t.serviceNL === service)
}