import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Werken bij Workflo | Join ons IT Team in Amsterdam',
  description: 'Werk mee aan de toekomst van IT in Amsterdam. Workflo zoekt getalenteerde IT professionals die het verschil willen maken voor het MKB.',
  openGraph: {
    title: 'Werken bij Workflo | IT Careers Amsterdam',
    description: 'Join het Workflo team en werk mee aan de toekomst van IT voor het MKB in Amsterdam.',
    images: ['/images/careers-og.jpg'],
  },
}

export default function WerkenBijLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}