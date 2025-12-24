'use client'

import { useState } from 'react'
import { motion } from '@/lib/framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  HeadphonesIcon, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Download,
  Zap,
  Shield,
  Settings
} from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

export default function ServicedeskPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('submit-ticket')
  
  const [ticketForm, setTicketForm] = useState({
    title: '',
    priority: '',
    category: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    company: ''
  })

  const priorityOptions = [
    { value: 'low', label: language === 'nl' ? 'Laag' : 'Low', color: 'green' },
    { value: 'medium', label: language === 'nl' ? 'Normaal' : 'Medium', color: 'yellow' },
    { value: 'high', label: language === 'nl' ? 'Hoog' : 'High', color: 'yellow' },
    { value: 'critical', label: language === 'nl' ? 'Kritiek' : 'Critical', color: 'red' }
  ]

  const categoryOptions = [
    { value: 'hardware', label: language === 'nl' ? 'Hardware Problemen' : 'Hardware Issues' },
    { value: 'software', label: language === 'nl' ? 'Software Problemen' : 'Software Issues' },
    { value: 'network', label: language === 'nl' ? 'Netwerk Problemen' : 'Network Issues' },
    { value: 'email', label: language === 'nl' ? 'E-mail Problemen' : 'Email Issues' },
    { value: 'security', label: language === 'nl' ? 'Security & Beveiliging' : 'Security Issues' },
    { value: 'backup', label: language === 'nl' ? 'Backup & Recovery' : 'Backup & Recovery' },
    { value: 'access', label: language === 'nl' ? 'Toegang & Accounts' : 'Access & Accounts' },
    { value: 'other', label: language === 'nl' ? 'Overig' : 'Other' }
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!ticketForm.title || !ticketForm.description || !ticketForm.email) {
      toast({
        title: language === 'nl' ? 'Incomplete formulier' : 'Incomplete form',
        description: language === 'nl' 
          ? 'Vul alle verplichte velden in.'
          : 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    // Simulate ticket submission
    toast({
      title: language === 'nl' ? 'Ticket ingediend!' : 'Ticket submitted!',
      description: language === 'nl' 
        ? 'Je support ticket is succesvol ingediend. Je ontvangt binnen 1 uur een reactie.'
        : 'Your support ticket has been submitted successfully. You will receive a response within 1 hour.',
    })

    // Reset form
    setTicketForm({
      title: '',
      priority: '',
      category: '',
      description: '',
      name: '',
      email: '',
      phone: '',
      company: ''
    })
  }

  const handleRemoteSupport = () => {
    toast({
      title: language === 'nl' ? 'Remote support wordt gestart...' : 'Starting remote support...',
      description: language === 'nl' 
        ? 'De remote support tool wordt gedownload. Volg de instructies om een sessie te starten.'
        : 'The remote support tool is being downloaded. Follow the instructions to start a session.',
    })
  }

  const emergencyServices = [
    {
      title: language === 'nl' ? 'Telefonische Support' : 'Phone Support',
      description: language === 'nl' ? 'Direct contact met onze experts' : 'Direct contact with our experts',
      phone: '020-30 80 465',
      hours: language === 'nl' ? 'Kantooruren: Ma-Vr 8:00-18:00' : 'Office hours: Mon-Fri 8:00-18:00',
      emergency: language === 'nl' ? 'Noodgevallen: 24/7' : 'Emergency: 24/7',
      icon: Phone
    },
    {
      title: language === 'nl' ? 'E-mail Support' : 'Email Support',
      description: language === 'nl' ? 'Gedetailleerde hulp via e-mail' : 'Detailed help via email',
      email: 'support@workflo.it',
      response: language === 'nl' ? 'Reactietijd: binnen 2 uur' : 'Response time: within 2 hours',
      icon: Mail
    },
    {
      title: language === 'nl' ? 'Remote Toegang' : 'Remote Access',
      description: language === 'nl' ? 'Directe hulp via remote toegang' : 'Direct help via remote access',
      action: language === 'nl' ? 'Start Remote Sessie' : 'Start Remote Session',
      secure: language === 'nl' ? 'Veilig & Encrypted' : 'Secure & Encrypted',
      icon: Settings
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <HeadphonesIcon className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="px-3 py-1">
                {language === 'nl' ? 'Workflo Servicedesk' : 'Workflo Servicedesk'}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'nl' ? (
                <>
                  We staan voor je{' '}
                  <span className="text-primary">klaar</span>
                </>
              ) : (
                <>
                  We're here to{' '}
                  <span className="text-primary">help</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'nl' 
                ? 'Hulp nodig? Ons support team staat 24/7 voor je klaar met snelle, professionele ondersteuning voor al je IT-uitdagingen.'
                : 'Need help? Our support team is available 24/7 with fast, professional assistance for all your IT challenges.'
              }
            </p>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="tel:+31203080465"
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'nl' ? 'Noodgevallen: 020-30 80 465' : 'Emergency: 020-30 80 465'}
                </span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{language === 'nl' ? 'Gemiddelde reactietijd: < 1 uur' : 'Average response time: < 1 hour'}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {emergencyServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        {service.title}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {service.phone && (
                        <div>
                          <a 
                            href={`tel:+31203080465`}
                            className="text-lg font-semibold text-primary hover:underline"
                          >
                            {service.phone}
                          </a>
                          <p className="text-sm text-muted-foreground">{service.hours}</p>
                          <p className="text-sm font-medium text-red-600">{service.emergency}</p>
                        </div>
                      )}
                      {service.email && (
                        <div>
                          <a 
                            href={`mailto:${service.email}`}
                            className="text-lg font-semibold text-primary hover:underline"
                          >
                            {service.email}
                          </a>
                          <p className="text-sm text-muted-foreground">{service.response}</p>
                        </div>
                      )}
                      {service.action && (
                        <div className="space-y-2">
                          <Button 
                            onClick={handleRemoteSupport}
                            className="w-full"
                            variant="outline"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {service.action}
                          </Button>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {service.secure}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Support Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="submit-ticket" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {language === 'nl' ? 'Ticket Indienen' : 'Submit Ticket'}
                </TabsTrigger>
                <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {language === 'nl' ? 'Kennisbank' : 'Knowledge Base'}
                </TabsTrigger>
              </TabsList>

              {/* Submit Ticket Tab */}
              <TabsContent value="submit-ticket">
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      {language === 'nl' ? 'Support Ticket Indienen' : 'Submit Support Ticket'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'nl' 
                        ? 'Beschrijf je probleem zo gedetailleerd mogelijk voor de beste hulp'
                        : 'Describe your issue in detail for the best assistance'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            {language === 'nl' ? 'Contactgegevens' : 'Contact Information'}
                          </h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              {language === 'nl' ? 'Naam' : 'Name'} *
                            </Label>
                            <Input
                              id="name"
                              value={ticketForm.name}
                              onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">
                              {language === 'nl' ? 'E-mail' : 'Email'} *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={ticketForm.email}
                              onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              {language === 'nl' ? 'Telefoon' : 'Phone'}
                            </Label>
                            <Input
                              id="phone"
                              value={ticketForm.phone}
                              onChange={(e) => setTicketForm({...ticketForm, phone: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company">
                              {language === 'nl' ? 'Bedrijf' : 'Company'}
                            </Label>
                            <Input
                              id="company"
                              value={ticketForm.company}
                              onChange={(e) => setTicketForm({...ticketForm, company: e.target.value})}
                            />
                          </div>
                        </div>

                        {/* Ticket Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            {language === 'nl' ? 'Probleem Details' : 'Issue Details'}
                          </h3>

                          <div className="space-y-2">
                            <Label htmlFor="title">
                              {language === 'nl' ? 'Onderwerp' : 'Subject'} *
                            </Label>
                            <Input
                              id="title"
                              value={ticketForm.title}
                              onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                              placeholder={language === 'nl' ? 'Korte beschrijving van het probleem' : 'Brief description of the issue'}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="priority">
                              {language === 'nl' ? 'Prioriteit' : 'Priority'}
                            </Label>
                            <Select 
                              value={ticketForm.priority} 
                              onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={language === 'nl' ? 'Selecteer prioriteit' : 'Select priority'} />
                              </SelectTrigger>
                              <SelectContent>
                                {priorityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">
                              {language === 'nl' ? 'Categorie' : 'Category'}
                            </Label>
                            <Select 
                              value={ticketForm.category} 
                              onValueChange={(value) => setTicketForm({...ticketForm, category: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={language === 'nl' ? 'Selecteer categorie' : 'Select category'} />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          {language === 'nl' ? 'Gedetailleerde Beschrijving' : 'Detailed Description'} *
                        </Label>
                        <Textarea
                          id="description"
                          rows={6}
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                          placeholder={language === 'nl' 
                            ? 'Beschrijf het probleem zo gedetailleerd mogelijk. Vermeld stappen om het probleem te reproduceren, foutmeldingen, en wat je al hebt geprobeerd.'
                            : 'Describe the problem in as much detail as possible. Include steps to reproduce the issue, error messages, and what you have already tried.'
                          }
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {language === 'nl' ? 'Ticket Indienen' : 'Submit Ticket'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Knowledge Base Tab */}
              <TabsContent value="knowledge-base">
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5 text-primary" />
                        {language === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'nl' 
                          ? 'Zoek snel antwoorden op veelvoorkomende vragen'
                          : 'Quickly find answers to common questions'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto p-4 text-left justify-start" asChild>
                        <a href="/faq">
                          <div>
                            <div className="font-medium">
                              {language === 'nl' ? 'Alle FAQ\'s bekijken' : 'View All FAQs'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'nl' ? 'Complete lijst met veelgestelde vragen' : 'Complete list of frequently asked questions'}
                            </div>
                          </div>
                        </a>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left justify-start" asChild>
                        <a href="mailto:support@workflo.it">
                          <div>
                            <div className="font-medium">
                              {language === 'nl' ? 'E-mail Support' : 'Email Support'}
                            </div>
                            <div className="text-sm text-muted-foreground">support@workflo.it</div>
                          </div>
                        </a>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left justify-start" onClick={handleRemoteSupport}>
                        <div>
                          <div className="font-medium">
                            {language === 'nl' ? 'Remote Support Tool' : 'Remote Support Tool'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === 'nl' ? 'Download directe hulp' : 'Download direct assistance'}
                          </div>
                        </div>
                      </Button>

                      <Button variant="outline" className="h-auto p-4 text-left justify-start" asChild>
                        <a href="tel:+31203080465">
                          <div>
                            <div className="font-medium">
                              {language === 'nl' ? 'Telefonische Support' : 'Phone Support'}
                            </div>
                            <div className="text-sm text-muted-foreground">020-30 80 465</div>
                          </div>
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Service Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        {language === 'nl' ? 'Service Status' : 'Service Status'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>{language === 'nl' ? 'E-mail Services' : 'Email Services'}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              {language === 'nl' ? 'Operationeel' : 'Operational'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{language === 'nl' ? 'Cloud Services' : 'Cloud Services'}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              {language === 'nl' ? 'Operationeel' : 'Operational'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{language === 'nl' ? 'Backup Services' : 'Backup Services'}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              {language === 'nl' ? 'Operationeel' : 'Operational'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  )
}