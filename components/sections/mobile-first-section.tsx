'use client'

import { motion } from 'framer-motion'
import { Smartphone, Tablet, Monitor, Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { VideoBackground, VideoSets } from '@/components/shared/video-background'

interface MobileFirstSectionProps {
  language: string
}

export function MobileFirstSection({ language }: MobileFirstSectionProps) {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      titleNL: 'Mobile-First Design',
      description: 'Your team works everywhere, your IT should too',
      descriptionNL: 'Jouw team werkt overal, je IT zou dat ook moeten doen',
    },
    {
      icon: Tablet,
      title: 'Cross-Device Sync',
      titleNL: 'Cross-Device Sync',
      description: 'Seamless experience across all devices',
      descriptionNL: 'Naadloze ervaring op alle apparaten',
    },
    {
      icon: Monitor,
      title: 'Desktop Integration',
      titleNL: 'Desktop Integratie',
      description: 'Full desktop power when you need it',
      descriptionNL: 'Volledige desktop kracht wanneer je het nodig hebt',
    },
    {
      icon: Wifi,
      title: 'Always Connected',
      titleNL: 'Altijd Verbonden',
      description: 'Reliable connectivity wherever you work',
      descriptionNL: 'Betrouwbare connectiviteit waar je ook werkt',
    }
  ]

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <VideoBackground 
        videos={VideoSets.mobile} 
        opacity={0.12} 
        overlay={true}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {language === 'nl' 
                ? 'Mobiel Werken, Desktop Kracht' 
                : 'Mobile Work, Desktop Power'
              }
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'nl' 
                ? 'Moderne werknemers hebben flexibiliteit nodig. Onze IT-oplossingen maken productief werken mogelijk vanaf elke locatie, op elk apparaat.'
                : 'Modern employees need flexibility. Our IT solutions enable productive work from any location, on any device.'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/80 backdrop-blur-sm border-border hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {language === 'nl' ? feature.titleNL : feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {language === 'nl' ? feature.descriptionNL : feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="bg-background/90 backdrop-blur-sm rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {language === 'nl' 
                  ? 'Klaar voor de Toekomst van Werk?' 
                  : 'Ready for the Future of Work?'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'nl' 
                  ? 'Van thuiswerken tot kantoor, van smartphone tot workstation - wij zorgen dat alles naadloos samenwerkt.'
                  : 'From home office to headquarters, from smartphone to workstation - we ensure everything works together seamlessly.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>📱 iOS & Android</span>
                <span>💻 Windows & macOS</span>
                <span>🌐 Web-based Access</span>
                <span>☁️ Cloud Sync</span>
                <span>🔒 Enterprise Security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}