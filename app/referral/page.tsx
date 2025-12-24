'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyEuroIcon,
  ArrowPathIcon,
  TrophyIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ReferralPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const whyJoinItems = [
    {
      icon: CurrencyEuroIcon,
      title: 'Aantrekkelijke directe beloning',
      description: 'Ontvang €150 tot €1.000 bij elke succesvolle referral, afhankelijk van de contractwaarde',
    },
    {
      icon: ArrowPathIcon,
      title: 'Blijvende inkomsten',
      description: '5% commissie op alle maandelijkse betalingen, zolang de klant actief blijft',
    },
    {
      icon: TrophyIcon,
      title: 'Extra milestone bonussen',
      description: 'Verdien extra bij 1, 3, 5 en 10 succesvolle referrals — tot €1.850 in bonussen',
    },
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Deel de contactgegevens',
      description:
        'Ken je een bedrijf dat baat heeft bij professionele IT-ondersteuning? Stuur ons de contactgegevens of gebruik je persoonlijke referral-link.',
      icon: UserGroupIcon,
    },
    {
      step: '02',
      title: 'Wij nemen het over',
      description:
        'Ons team neemt contact op, voert de gesprekken en zorgt voor een goede match. Jij hoeft verder niets te doen — we houden je op de hoogte.',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      step: '03',
      title: 'Verdien direct én doorlopend',
      description:
        'Bij contractondertekening krijg je direct €150-€1.000 uitbetaald. Daarna ontvang je maandelijks 5% commissie op alle betalingen van de klant.',
      icon: CurrencyEuroIcon,
    },
  ];

  const rewardStructure = [
    {
      range: '€0 - €5.000',
      upfront: '€150',
      commission: '5%',
    },
    {
      range: '€5.000 - €15.000',
      upfront: '€300',
      commission: '5%',
    },
    {
      range: '€15.000 - €30.000',
      upfront: '€500',
      commission: '5%',
    },
    {
      range: '€30.000+',
      upfront: '€1.000',
      commission: '5%',
    },
  ];

  const milestoneBonuses = [
    {
      milestone: '1 referral',
      bonus: '€100',
      icon: '🎯',
    },
    {
      milestone: '3 referrals',
      bonus: '€250',
      icon: '🚀',
    },
    {
      milestone: '5 referrals',
      bonus: '€500',
      icon: '⭐',
    },
    {
      milestone: '10 referrals',
      bonus: '€1.000',
      icon: '👑',
    },
  ];

  const faqs = [
    {
      question: 'Wanneer ontvang ik mijn beloning?',
      answer:
        'De directe beloning (€150-€1.000) ontvang je binnen 30 dagen na contractondertekening. De maandelijkse commissie van 5% betalen we uit binnen 14 dagen nadat de klant zijn factuur heeft betaald.',
    },
    {
      question: 'Hoe lang blijf ik commissie ontvangen?',
      answer:
        'Zolang de klant actief is bij Workflo, blijf je 5% commissie ontvangen op alle maandelijkse betalingen. Dit kan jaren zijn. Komt een klant later terug? Dan hervat de commissie automatisch.',
    },
    {
      question: 'Wat als de klant zijn contract beëindigt?',
      answer:
        'De directe beloning blijft altijd van jou. De maandelijkse commissie stopt zodra de klant zijn contract beëindigt. Keert de klant in de toekomst terug, dan hervatten we de commissiebetalingen.',
    },
    {
      question: 'Hoeveel bedrijven kan ik verwijzen?',
      answer:
        'Er is geen limiet. Je kunt zoveel bedrijven doorverwijzen als je wilt, en tegelijk aan meerdere referrals werken. Hoe meer referrals, hoe meer milestone bonussen je verdient.',
    },
    {
      question: 'Welke bedrijven komen in aanmerking?',
      answer:
        'Elk bedrijf dat nog geen klant is bij Workflo. We richten ons vooral op MKB-bedrijven met 10-250 medewerkers die IT-ondersteuning, managed services of cybersecurity-oplossingen nodig hebben.',
    },
    {
      question: 'Moet ik zelf verkopen?',
      answer:
        'Nee. Jij geeft alleen de contactgegevens door. Ons salesteam voert alle gesprekken, demo\'s en onderhandelingen. Je kunt desgewenst bij gesprekken aanwezig zijn, maar dat hoeft niet.',
    },
    {
      question: 'Hoe werkt de uitbetaling?',
      answer:
        'Je ontvangt maandelijks een overzicht per e-mail. Uitbetaling gebeurt via bankoverschrijving naar je opgegeven rekening. Bedragen vanaf €100 worden direct uitbetaald; lagere bedragen worden gecumuleerd.',
    },
    {
      question: 'Kan ik de status van mijn referrals volgen?',
      answer:
        'Ja. Je krijgt toegang tot een persoonlijk dashboard waar je realtime ziet: welke referrals in welke fase zitten, hoeveel commissie je hebt verdiend, wanneer uitbetalingen plaatsvinden, en je voortgang naar milestone bonussen.',
    },
    {
      question: 'Wat is de jaarlijkse contractwaarde?',
      answer:
        'Dit is het totale bedrag dat de klant per jaar betaalt voor onze diensten. Een klant met bijvoorbeeld €2.000/maand betaalt €24.000 per jaar — dat valt in de categorie €15.000-€30.000, waarmee je €500 directe beloning krijgt.',
    },
    {
      question: 'Zijn er kosten aan verbonden?',
      answer:
        'Nee. Deelname aan ons referral programma is volledig gratis. Er zijn geen verplichtingen, targets of lidmaatschapskosten. Je verdient alleen als je een succesvolle referral doet.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-neutral-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900">
                <TrophyIcon className="h-4 w-4" />
                Referral Programma
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              Verdien €150-€1.000 per referral + 5% blijvende commissie
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400"
            >
              Ken je bedrijven die betere IT-ondersteuning nodig hebben? Verwijs ze door naar Workflo en verdien direct én doorlopend. Simpel, transparant, zonder gedoe.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="#hoe-werkt-het"
                className="w-full sm:w-auto rounded-lg bg-neutral-900 dark:bg-white px-8 py-3.5 text-base font-semibold text-white dark:text-neutral-900 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 hover:scale-105"
              >
                Aan de slag
              </Link>
              <Link
                href="#beloningen"
                className="w-full sm:w-auto rounded-lg border-2 border-neutral-900 dark:border-white px-8 py-3.5 text-base font-semibold text-neutral-900 dark:text-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-all duration-200"
              >
                Bekijk beloningen
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Waarom deelnemen aan ons programma?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
            >
              Aantrekkelijke beloningen, volledige transparantie en geen verplichtingen
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyJoinItems.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-800/50 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-6 w-6 text-white dark:text-neutral-900" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="hoe-werkt-het" className="py-20 sm:py-32 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Zo werkt het
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
            >
              Drie stappen naar je eerste beloning — wij doen het zware werk
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-neutral-950 p-8 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 transition-all duration-300 hover:shadow-lg hover:ring-neutral-300 dark:hover:ring-neutral-700">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white">
                      <step.icon className="h-7 w-7 text-white dark:text-neutral-900" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                        STEP {step.step}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-400 flex-1">
                    {step.description}
                  </p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reward Structure Section */}
      <section id="beloningen" className="py-20 sm:py-32 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Beloningsstructuur
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
            >
              Transparante beloningen op basis van contractwaarde
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                  <thead className="bg-neutral-100 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                        Jaarlijkse contractwaarde
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                        Direct uitbetaling
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                        Maandelijkse commissie
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                    {rewardStructure.map((tier, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                          {tier.range}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {tier.upfront}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {tier.commission} commissie
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Example Box */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mt-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 p-8 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-neutral-900">
                  <CurrencyEuroIcon className="h-6 w-6 text-neutral-900 dark:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white dark:text-neutral-900">
                    Rekenvoorbeeld
                  </h3>
                  <p className="mt-2 text-neutral-300 dark:text-neutral-700">
                    Klant met jaarcontract van €24.000 (€2.000/maand):
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between items-center text-neutral-300 dark:text-neutral-700">
                      <span>Directe beloning bij ondertekening:</span>
                      <span className="font-semibold text-white dark:text-neutral-900">€500</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-300 dark:text-neutral-700">
                      <span>Commissie per maand (5% van €2.000):</span>
                      <span className="font-semibold text-white dark:text-neutral-900">
                        €100
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-300 dark:text-neutral-700">
                      <span>Totale commissie jaar 1 (12× €100):</span>
                      <span className="font-semibold text-white dark:text-neutral-900">
                        €1.200
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-700 dark:border-neutral-300 flex justify-between items-center">
                      <span className="font-semibold text-white dark:text-neutral-900">
                        Totaal eerste jaar:
                      </span>
                      <span className="text-2xl font-bold text-white dark:text-neutral-900">
                        €1.700
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Milestone Bonuses Section */}
      <section className="py-20 sm:py-32 bg-neutral-50 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Extra milestone bonussen
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
            >
              Verdien extra bij elke belangrijke mijlpaal — tot €1.850 in bonussen
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
          >
            {milestoneBonuses.map((milestone, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-950 p-6 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{milestone.icon}</div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {milestone.bonus}
                </div>
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {milestone.milestone}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
            >
              Veelgestelde vragen
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
            >
              Alles wat je moet weten over ons referral programma
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 transition-all duration-200 hover:ring-neutral-300 dark:hover:ring-neutral-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUpIcon className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
                    <p className="text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-neutral-900/[0.04] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <RocketLaunchIcon className="mx-auto h-16 w-16 text-white dark:text-neutral-900" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white dark:text-neutral-900 sm:text-4xl"
            >
              Start vandaag nog met verdienen
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-neutral-300 dark:text-neutral-700"
            >
              Meld je aan voor het referral programma. We sturen je je persoonlijke link en toegang tot het dashboard. Geen gedoe, geen verplichtingen.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-neutral-900 px-8 py-4 text-base font-semibold text-neutral-900 dark:text-white shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 hover:scale-105"
              >
                Aanmelden als partner
                <RocketLaunchIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
