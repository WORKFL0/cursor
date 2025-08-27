'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { 
  Gift, 
  Users, 
  Trophy, 
  Star, 
  Euro, 
  Send, 
  Mail, 
  UserPlus,
  CheckCircle,
  TrendingUp,
  Zap,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  Copy,
  Share2
} from 'lucide-react'
import Link from 'next/link'

export default function ReferralPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [referralCode, setReferralCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('newsletter')

  // Form states
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [referralForm, setReferralForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    referredBy: ''
  })
  const [inviteEmails, setInviteEmails] = useState('')

  const rewards = [
    {
      level: 1,
      referrals: 1,
      reward: language === 'nl' ? '€50 korting' : '€50 discount',
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      level: 2,
      referrals: 3,
      reward: language === 'nl' ? '€150 korting' : '€150 discount',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      level: 3,
      referrals: 5,
      reward: language === 'nl' ? '1 maand gratis service' : '1 month free service',
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      level: 4,
      referrals: 10,
      reward: language === 'nl' ? 'iPad Pro' : 'iPad Pro',
      icon: Award,
      color: 'text-workflo-yellow',
      bgColor: 'bg-workflo-yellow dark:bg-workflo-yellow/20'
    }
  ]

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: language === 'nl' ? 'Succesvol aangemeld!' : 'Successfully subscribed!',
        description: language === 'nl' 
          ? 'Je ontvangt binnenkort onze nieuwsbrief met exclusieve aanbiedingen.'
          : 'You will receive our newsletter with exclusive offers soon.',
      })
      setNewsletterEmail('')
      setIsLoading(false)
    }, 1000)
  }

  const handleReferralSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Generate referral code
    const code = `WF${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    setTimeout(() => {
      setReferralCode(code)
      toast({
        title: language === 'nl' ? 'Welkom bij het Referral Program!' : 'Welcome to the Referral Program!',
        description: language === 'nl' 
          ? `Je persoonlijke referral code is: ${code}`
          : `Your personal referral code is: ${code}`,
      })
      setReferralForm({ name: '', email: '', company: '', phone: '', referredBy: '' })
      setIsLoading(false)
    }, 1000)
  }

  const handleInviteFriends = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const emails = inviteEmails.split(',').map(e => e.trim()).filter(e => e)
    
    setTimeout(() => {
      toast({
        title: language === 'nl' ? 'Uitnodigingen verstuurd!' : 'Invitations sent!',
        description: language === 'nl' 
          ? `${emails.length} uitnodigingen zijn verstuurd.`
          : `${emails.length} invitations have been sent.`,
      })
      setInviteEmails('')
      setIsLoading(false)
    }, 1000)
  }

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      toast({
        title: language === 'nl' ? 'Gekopieerd!' : 'Copied!',
        description: language === 'nl' 
          ? 'Referral code is gekopieerd naar klembord.'
          : 'Referral code copied to clipboard.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6"
            >
              <Gift className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6">
              {language === 'nl' 
                ? 'Word Beloond voor het Delen van Workflo'
                : 'Get Rewarded for Sharing Workflo'
              }
            </h1>
            
            <p className="text-xl text-muted-foreground dark:text-gray-300 mb-8">
              {language === 'nl'
                ? 'Verdien kortingen, gratis services en exclusieve beloningen door vrienden en collega\'s door te verwijzen naar onze IT-diensten.'
                : 'Earn discounts, free services, and exclusive rewards by referring friends and colleagues to our IT services.'
              }
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {language === 'nl' ? '50+ Actieve Verwijzers' : '50+ Active Referrers'}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Euro className="w-4 h-4 mr-2" />
                {language === 'nl' ? '€50.000+ Uitgekeerd' : '€50,000+ Paid Out'}
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {language === 'nl' ? 'Top Rewards Programma' : 'Top Rewards Program'}
              </Badge>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-foreground dark:text-white mb-12">
              {language === 'nl' ? 'Hoe Het Werkt' : 'How It Works'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  icon: UserPlus,
                  title: language === 'nl' ? 'Meld Je Aan' : 'Sign Up',
                  description: language === 'nl' 
                    ? 'Registreer voor ons referral programma en ontvang je unieke code'
                    : 'Register for our referral program and receive your unique code'
                },
                {
                  step: 2,
                  icon: Share2,
                  title: language === 'nl' ? 'Deel & Verwijs' : 'Share & Refer',
                  description: language === 'nl'
                    ? 'Deel je code met vrienden, familie en zakelijke contacten'
                    : 'Share your code with friends, family, and business contacts'
                },
                {
                  step: 3,
                  icon: Gift,
                  title: language === 'nl' ? 'Verdien Beloningen' : 'Earn Rewards',
                  description: language === 'nl'
                    ? 'Ontvang kortingen en prijzen voor elke succesvolle verwijzing'
                    : 'Receive discounts and prizes for every successful referral'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                        <item.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <Badge className="mb-2">{language === 'nl' ? 'Stap' : 'Step'} {item.step}</Badge>
                        <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground dark:text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rewards Tiers */}
      <section className="py-16 bg-muted/50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-foreground dark:text-white mb-4">
              {language === 'nl' ? 'Beloningen & Prijzen' : 'Rewards & Prizes'}
            </h2>
            <p className="text-center text-muted-foreground dark:text-gray-300 mb-12">
              {language === 'nl' 
                ? 'Hoe meer je verwijst, hoe groter de beloningen!'
                : 'The more you refer, the bigger the rewards!'
              }
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewards.map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className={`w-full p-4 rounded-lg ${reward.bgColor}`}>
                        <reward.icon className={`w-12 h-12 ${reward.color} mx-auto`} />
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="outline" className="mb-2">
                        {language === 'nl' ? 'Level' : 'Level'} {reward.level}
                      </Badge>
                      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                        {reward.referrals} {language === 'nl' ? 'Verwijzingen' : 'Referrals'}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        {reward.reward}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="py-8">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                    {language === 'nl' ? 'Exclusieve VIP Status' : 'Exclusive VIP Status'}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 mb-4">
                    {language === 'nl' 
                      ? '20+ verwijzingen: Word VIP partner met permanente kortingen en prioriteit support'
                      : '20+ referrals: Become a VIP partner with permanent discounts and priority support'
                    }
                  </p>
                  <Badge className="bg-primary text-primary-foreground">
                    {language === 'nl' ? '25% Levenslange Korting' : '25% Lifetime Discount'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sign Up Forms */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="newsletter">
                  <Mail className="w-4 h-4 mr-2" />
                  {language === 'nl' ? 'Nieuwsbrief' : 'Newsletter'}
                </TabsTrigger>
                <TabsTrigger value="referral">
                  <Users className="w-4 h-4 mr-2" />
                  {language === 'nl' ? 'Referral Program' : 'Referral Program'}
                </TabsTrigger>
                <TabsTrigger value="invite">
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'nl' ? 'Nodig Uit' : 'Invite'}
                </TabsTrigger>
              </TabsList>

              {/* Newsletter Tab */}
              <TabsContent value="newsletter">
                <HubSpotNewsletterSignup variant="full" />
              </TabsContent>

              {/* Referral Program Tab */}
              <TabsContent value="referral">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'nl' ? 'Word Referral Partner' : 'Become a Referral Partner'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'nl' 
                        ? 'Registreer je voor ons referral programma en begin direct met het verdienen van beloningen.'
                        : 'Register for our referral program and start earning rewards immediately.'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralCode ? (
                      <div className="space-y-6">
                        <div className="bg-primary/10 p-6 rounded-lg text-center">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                            {language === 'nl' ? 'Je bent aangemeld!' : 'You\'re signed up!'}
                          </h3>
                          <p className="text-muted-foreground dark:text-gray-300 mb-4">
                            {language === 'nl' ? 'Je persoonlijke referral code:' : 'Your personal referral code:'}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <code className="text-2xl font-mono font-bold text-primary bg-card dark:bg-gray-800 px-4 py-2 rounded">
                              {referralCode}
                            </code>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={copyReferralCode}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <Link href="/dashboard">
                            {language === 'nl' ? 'Naar Dashboard' : 'Go to Dashboard'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleReferralSignup} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">
                              {language === 'nl' ? 'Volledige Naam' : 'Full Name'}
                            </Label>
                            <Input
                              id="name"
                              value={referralForm.name}
                              onChange={(e) => setReferralForm({...referralForm, name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">
                              {language === 'nl' ? 'E-mailadres' : 'Email Address'}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={referralForm.email}
                              onChange={(e) => setReferralForm({...referralForm, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company">
                              {language === 'nl' ? 'Bedrijfsnaam' : 'Company Name'}
                            </Label>
                            <Input
                              id="company"
                              value={referralForm.company}
                              onChange={(e) => setReferralForm({...referralForm, company: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">
                              {language === 'nl' ? 'Telefoonnummer' : 'Phone Number'}
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={referralForm.phone}
                              onChange={(e) => setReferralForm({...referralForm, phone: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="referredBy">
                            {language === 'nl' ? 'Referral Code (optioneel)' : 'Referral Code (optional)'}
                          </Label>
                          <Input
                            id="referredBy"
                            placeholder={language === 'nl' ? 'Als je bent doorverwezen' : 'If you were referred'}
                            value={referralForm.referredBy}
                            onChange={(e) => setReferralForm({...referralForm, referredBy: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="terms" required className="rounded" />
                          <Label htmlFor="terms" className="text-sm">
                            {language === 'nl' 
                              ? 'Ik ga akkoord met de voorwaarden van het referral programma'
                              : 'I agree to the referral program terms and conditions'
                            }
                          </Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            language === 'nl' ? 'Registreren...' : 'Registering...'
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              {language === 'nl' ? 'Start met Verwijzen' : 'Start Referring'}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Invite Friends Tab */}
              <TabsContent value="invite">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'nl' ? 'Nodig Vrienden Uit' : 'Invite Friends'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'nl' 
                        ? 'Stuur uitnodigingen naar vrienden en collega\'s om deel te nemen aan ons referral programma.'
                        : 'Send invitations to friends and colleagues to join our referral program.'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInviteFriends} className="space-y-4">
                      <div>
                        <Label htmlFor="invite-emails">
                          {language === 'nl' ? 'E-mailadressen' : 'Email Addresses'}
                        </Label>
                        <Textarea
                          id="invite-emails"
                          placeholder={language === 'nl' 
                            ? 'email1@voorbeeld.nl, email2@voorbeeld.nl, ...'
                            : 'email1@example.com, email2@example.com, ...'
                          }
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                          rows={4}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {language === 'nl' 
                            ? 'Scheid meerdere e-mailadressen met komma\'s'
                            : 'Separate multiple email addresses with commas'
                          }
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="personal-message">
                          {language === 'nl' ? 'Persoonlijk Bericht (optioneel)' : 'Personal Message (optional)'}
                        </Label>
                        <Textarea
                          id="personal-message"
                          placeholder={language === 'nl' 
                            ? 'Voeg een persoonlijk bericht toe aan je uitnodiging...'
                            : 'Add a personal message to your invitation...'
                          }
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          language === 'nl' ? 'Versturen...' : 'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {language === 'nl' ? 'Verstuur Uitnodigingen' : 'Send Invitations'}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-foreground dark:text-white mb-12">
              {language === 'nl' ? 'Waarom Deelnemen?' : 'Why Join?'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: language === 'nl' ? 'Passief Inkomen' : 'Passive Income',
                  description: language === 'nl'
                    ? 'Verdien doorlopend commissie voor elke klant die je aanmeldt'
                    : 'Earn ongoing commission for every customer you sign up'
                },
                {
                  icon: Zap,
                  title: language === 'nl' ? 'Snelle Uitbetaling' : 'Fast Payout',
                  description: language === 'nl'
                    ? 'Ontvang je beloningen binnen 30 dagen na succesvolle verwijzing'
                    : 'Receive your rewards within 30 days of successful referral'
                },
                {
                  icon: Heart,
                  title: language === 'nl' ? 'Help Je Netwerk' : 'Help Your Network',
                  description: language === 'nl'
                    ? 'Deel waardevolle IT-oplossingen met je zakelijke contacten'
                    : 'Share valuable IT solutions with your business contacts'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            {language === 'nl' 
              ? 'Begin Vandaag met Verdienen'
              : 'Start Earning Today'
            }
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            {language === 'nl'
              ? 'Sluit je aan bij honderden tevreden partners die al profiteren van ons referral programma.'
              : 'Join hundreds of satisfied partners already benefiting from our referral program.'
            }
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setActiveTab('referral')}
            className="text-lg px-8 py-6"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {language === 'nl' ? 'Word Referral Partner' : 'Become a Referral Partner'}
          </Button>
        </motion.div>
      </section>
    </div>
  )
}