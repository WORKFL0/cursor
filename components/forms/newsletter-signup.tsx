'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/contexts/language-context'
import { Mail, Send, Loader2, CheckCircle, Sparkles } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'compact' | 'full'
  className?: string
}

export function NewsletterSignup({ variant = 'compact', className = '' }: NewsletterSignupProps) {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: language === 'nl' ? 'E-mail vereist' : 'Email required',
        description: language === 'nl' 
          ? 'Voer je e-mailadres in om je in te schrijven.'
          : 'Please enter your email address to subscribe.',
        variant: 'destructive'
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: language === 'nl' ? 'Ongeldig e-mailadres' : 'Invalid email address',
        description: language === 'nl' 
          ? 'Voer een geldig e-mailadres in.'
          : 'Please enter a valid email address.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would typically send the email to your newsletter service
      console.log('Newsletter subscription:', email)
      
      setIsSubscribed(true)
      toast({
        title: language === 'nl' ? 'Inschrijving succesvol!' : 'Subscription successful!',
        description: language === 'nl' 
          ? 'Je ontvangt binnenkort onze nieuwsbrief in je inbox.'
          : 'You will receive our newsletter in your inbox soon.',
      })

      setEmail('')
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
      
    } catch (error) {
      toast({
        title: language === 'nl' ? 'Fout opgetreden' : 'Error occurred',
        description: language === 'nl' 
          ? 'Er ging iets mis. Probeer het later opnieuw.'
          : 'Something went wrong. Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`bg-card dark:bg-card rounded-lg p-6 shadow-lg border hover:shadow-xl transition-shadow ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Mail className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {language === 'nl' ? 'IT Tips & Nieuws' : 'IT Tips & News'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Blijf op de hoogte van IT-trends' : 'Stay informed about IT trends'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language === 'nl' ? 'uw@email.nl' : 'your@email.com'}
            className="focus:ring-primary focus:border-primary"
            disabled={isSubmitting || isSubscribed}
          />
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'nl' ? 'Bezig...' : 'Loading...'}
                </>
              ) : isSubscribed ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {language === 'nl' ? 'Ingeschreven!' : 'Subscribed!'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'nl' ? 'Inschrijven' : 'Subscribe'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
        
        <p className="text-xs text-muted-foreground mt-2">
          {language === 'nl' 
            ? 'Wekelijks tips en updates. Uitschrijven altijd mogelijk.'
            : 'Weekly tips and updates. Unsubscribe anytime.'
          }
        </p>
      </motion.div>
    )
  }

  // Full variant for dedicated sections - redesigned with better aesthetics
  return (
    <motion.div 
      className={`relative bg-black dark:bg-gray-900 rounded-2xl p-8 lg:p-12 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245, 158, 11, 0.1) 35px, rgba(245, 158, 11, 0.1) 70px)`,
        }} />
      </div>
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-3xl rounded-full" />
      <div className="max-w-md mx-auto text-center relative z-10">
        <motion.div 
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Mail className="w-8 h-8 text-black" />
        </motion.div>
        
        <motion.h3 
          className="text-2xl lg:text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {language === 'nl' ? '🚀 Blijf Voorop Met IT Nieuws' : '🚀 Stay Ahead With IT News'}
        </motion.h3>
        
        <motion.p 
          className="text-lg text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {language === 'nl' 
            ? 'Wekelijkse cybersecurity waarschuwingen, IT-tips en exclusive Workflo updates.'
            : 'Weekly cybersecurity alerts, IT tips and exclusive Workflo updates.'
          }
        </motion.p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'nl' ? 'jouw@email.nl' : 'your@email.com'}
              className="flex-1 bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
              disabled={isSubmitting || isSubscribed}
            />
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || isSubscribed}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'nl' ? 'Bezig...' : 'Loading...'}
                  </>
                ) : isSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {language === 'nl' ? 'Ingeschreven!' : 'Subscribed!'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'nl' ? 'Inschrijven' : 'Subscribe'}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
        
        <motion.div 
          className="mt-6 space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            {language === 'nl' 
              ? 'Je gegevens zijn veilig bij ons. Altijd.'
              : 'Your data is safe with us. Always.'
            }
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary" />
              {language === 'nl' ? 'Geen spam' : 'No spam'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary" />
              {language === 'nl' ? 'Wekelijks nieuws' : 'Weekly news'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-primary" />
              {language === 'nl' ? 'Direct uitschrijven' : 'Instant unsubscribe'}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}