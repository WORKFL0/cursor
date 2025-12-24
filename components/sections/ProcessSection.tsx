'use client'

import { Calendar, FileText, CheckCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/contexts/language-context'
import Link from 'next/link'

export default function ProcessSection() {
    const { language } = useLanguage()

    const steps = [
        {
            number: '01',
            title: 'Gratis IT-Scan',
            titleEN: 'Free IT Assessment',
            description: 'We komen langs voor een vrijblijvend gesprek en analyseren je huidige IT-situatie.',
            descriptionEN: 'We visit for a non-binding consultation and analyze your current IT situation.',
            icon: Calendar
        },
        {
            number: '02',
            title: 'Advies op Maat',
            titleEN: 'Tailored Advice',
            description: 'Je ontvangt een duidelijk plan van aanpak. Geen verplichtingen, wel helderheid.',
            descriptionEN: 'You receive a clear action plan. No obligations, just clarity.',
            icon: FileText
        },
        {
            number: '03',
            title: 'Zorgeloos Werken',
            titleEN: 'Worry-free Work',
            description: 'Wij regelen de migratie en het beheer. Jij focust je weer volledig op je bedrijf.',
            descriptionEN: 'We handle migration and management. You focus fully on your business again.',
            icon: CheckCircle
        }
    ]

    return (
        <section className="workflo-section-spacing bg-workflo-gray-50 dark:bg-workflo-black relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-workflo-yellow-light/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-workflo-yellow font-semibold tracking-wide uppercase text-sm mb-4 block"
                    >
                        {language === 'nl' ? 'Zo werkt het' : 'How it works'}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="workflo-h2 text-workflo-black dark:text-white mb-6"
                    >
                        {language === 'nl' ? 'In 3 stappen naar zorgeloze IT' : 'In 3 steps to worry-free IT'}
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-workflo-yellow/0 via-workflo-yellow/50 to-workflo-yellow/0 z-0" />

                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-workflo-gray-900 border-2 border-workflo-gray-100 dark:border-workflo-gray-800 flex items-center justify-center mb-6 shadow-sm group-hover:border-workflo-yellow group-hover:shadow-md transition-all duration-300">
                                    <div className="w-12 h-12 text-workflo-black dark:text-white group-hover:text-workflo-yellow transition-colors duration-300">
                                        <Icon className="w-full h-full stroke-[1.5]" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-workflo-black dark:text-white mb-3 flex items-center gap-2">
                                    <span className="text-workflo-yellow opacity-50 text-sm font-mono">{step.number}</span>
                                    {language === 'nl' ? step.title : step.titleEN}
                                </h3>

                                <p className="text-workflo-gray-600 dark:text-workflo-gray-300 leading-relaxed max-w-xs mx-auto">
                                    {language === 'nl' ? step.description : step.descriptionEN}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <Button asChild variant="workflo" size="lg">
                        <Link href="/contact">
                            {language === 'nl' ? 'Start met stap 1' : 'Start with step 1'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
