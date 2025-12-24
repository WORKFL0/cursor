import { Resend } from 'resend'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  services?: string[]
  submittedAt?: string
  userAgent?: string
  referrer?: string
}

export interface QuoteRequestData extends ContactFormData {
  budget?: string
  timeline?: string
  urgency?: 'low' | 'medium' | 'high'
}

export interface NewsletterSubscriptionData {
  email: string
  language?: string
  source?: string
  subscribedAt?: string
}

export interface ReferralFormData {
  referrerName: string
  referrerEmail: string
  referrerPhone?: string
  referrerCompany?: string
  referredName: string
  referredEmail: string
  referredPhone?: string
  referredCompany: string
  relationship?: string
  message?: string
  submittedAt?: string
  userAgent?: string
  referrer?: string
}

export interface EmailTemplateData {
  to: string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

class EmailService {
  private resend: Resend | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('RESEND_API_KEY not found in environment variables. Email service will be disabled.')
      return
    }

    try {
      this.resend = new Resend(apiKey)
      this.isInitialized = true
      console.log('Email service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize email service:', error)
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.resend !== null
  }

  /**
   * Send contact form submission email to Workflo team
   */
  public async sendContactFormNotification(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const servicesText = data.services && data.services.length > 0 
        ? `\n\nInteresse in diensten:\n${data.services.map(s => `- ${s}`).join('\n')}`
        : ''

      const htmlContent = this.generateContactFormHtml(data, servicesText)
      const textContent = this.generateContactFormText(data, servicesText)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: ['info@workflo.nl', 'work@workflo.nl'],
        subject: `Nieuw contactformulier: ${data.subject}`,
        html: htmlContent,
        text: textContent,
        replyTo: data.email,
        tags: [
          { name: 'type', value: 'contact-form' },
          { name: 'subject', value: data.subject }
        ]
      })

      if (result.error) {
        console.error('Email send error:', result.error)
        return { success: false, error: result.error.message }
      }

      console.log('Contact form email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send contact form email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send confirmation email to the person who submitted the form
   */
  public async sendContactFormConfirmation(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const htmlContent = this.generateConfirmationHtml(data)
      const textContent = this.generateConfirmationText(data)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: [data.email],
        subject: 'Bevestiging: We hebben je bericht ontvangen - Workflo',
        html: htmlContent,
        text: textContent,
        replyTo: 'info@workflo.nl',
        tags: [
          { name: 'type', value: 'contact-confirmation' }
        ]
      })

      if (result.error) {
        console.error('Confirmation email error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send confirmation email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send quote request notification email to Workflo team
   */
  public async sendQuoteRequestNotification(data: QuoteRequestData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const servicesText = data.services && data.services.length > 0 
        ? `\n\nGewenste diensten:\n${data.services.map(s => `- ${s}`).join('\n')}`
        : ''

      const htmlContent = this.generateQuoteRequestHtml(data, servicesText)
      const textContent = this.generateQuoteRequestText(data, servicesText)

      const urgencyPrefix = data.urgency === 'high' ? '🔥 URGENT - ' : data.urgency === 'low' ? '📋 ' : '⚡ '
      
      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: ['info@workflo.nl', 'work@workflo.nl'],
        subject: `${urgencyPrefix}Nieuw offerteverzoek: ${data.services?.join(', ') || 'Geen diensten'}`,
        html: htmlContent,
        text: textContent,
        replyTo: data.email,
        tags: [
          { name: 'type', value: 'quote-request' },
          { name: 'urgency', value: data.urgency || 'medium' },
          { name: 'services', value: data.services?.join(',') || 'none' }
        ]
      })

      if (result.error) {
        console.error('Quote request email error:', result.error)
        return { success: false, error: result.error.message }
      }

      console.log('Quote request email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send quote request email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send quote request confirmation email to the person who submitted the form
   */
  public async sendQuoteRequestConfirmation(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const htmlContent = this.generateQuoteConfirmationHtml(data)
      const textContent = this.generateQuoteConfirmationText(data)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: [data.email],
        subject: 'Bevestiging: We hebben je offerteverzoek ontvangen - Workflo',
        html: htmlContent,
        text: textContent,
        replyTo: 'info@workflo.nl',
        tags: [
          { name: 'type', value: 'quote-confirmation' }
        ]
      })

      if (result.error) {
        console.error('Quote confirmation email error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send quote confirmation email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send referral form notification email to Workflo team
   */
  public async sendReferralNotification(data: ReferralFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const htmlContent = this.generateReferralNotificationHtml(data)
      const textContent = this.generateReferralNotificationText(data)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: ['info@workflo.nl', 'work@workflo.nl'],
        subject: `Nieuwe Referral: ${data.referredCompany} - Verwezen door ${data.referrerName}`,
        html: htmlContent,
        text: textContent,
        replyTo: data.referrerEmail,
        tags: [
          { name: 'type', value: 'referral' },
          { name: 'referrer', value: data.referrerEmail },
          { name: 'referred', value: data.referredEmail }
        ]
      })

      if (result.error) {
        console.error('Referral notification email error:', result.error)
        return { success: false, error: result.error.message }
      }

      console.log('Referral notification email sent successfully:', result.data?.id)
      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send referral notification email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send referral thank you email to the referrer
   */
  public async sendReferralThankYou(data: ReferralFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const htmlContent = this.generateReferralThankYouHtml(data)
      const textContent = this.generateReferralThankYouText(data)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: [data.referrerEmail],
        subject: 'Bedankt voor je referral! - Workflo',
        html: htmlContent,
        text: textContent,
        replyTo: 'info@workflo.nl',
        tags: [
          { name: 'type', value: 'referral-thank-you' }
        ]
      })

      if (result.error) {
        console.error('Referral thank you email error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send referral thank you email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send introduction email to the referred company
   */
  public async sendReferralIntroduction(data: ReferralFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const htmlContent = this.generateReferralIntroductionHtml(data)
      const textContent = this.generateReferralIntroductionText(data)

      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: [data.referredEmail],
        subject: `${data.referrerName} heeft Workflo aan je aanbevolen`,
        html: htmlContent,
        text: textContent,
        replyTo: 'info@workflo.nl',
        tags: [
          { name: 'type', value: 'referral-introduction' }
        ]
      })

      if (result.error) {
        console.error('Referral introduction email error:', result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send referral introduction email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Send custom email
   */
  public async sendEmail(data: EmailTemplateData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'Email service not available' }
    }

    try {
      const result = await this.resend!.emails.send({
        from: 'noreply@workflo.nl',
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        replyTo: data.replyTo || 'info@workflo.nl'
      })

      if (result.error) {
        return { success: false, error: result.error.message }
      }

      return { success: true, messageId: result.data?.id }
    } catch (error: unknown) {
      console.error('Failed to send custom email:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  private generateContactFormHtml(data: ContactFormData, servicesText: string): string {
    const currentDate = new Date().toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuw Contactformulier - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; }
        .value { background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #f2f400; }
        .message { background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; white-space: pre-wrap; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .urgent { background: #fff3cd; border-color: #ffeaa7; color: #856404; padding: 12px; border-radius: 4px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nieuw Contactformulier</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Ontvangen op ${currentDate}</p>
        </div>
        
        <div class="content">
            ${data.subject.includes('support-request') || data.subject.includes('urgent') ? 
                '<div class="urgent">⚠️ <strong>Mogelijk urgent verzoek!</strong> Controleer het onderwerp en bericht voor urgentie.</div>' : ''}
            
            <div class="field">
                <span class="label">Naam:</span>
                <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
                <span class="label">E-mail:</span>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            
            ${data.phone ? `
            <div class="field">
                <span class="label">Telefoon:</span>
                <div class="value"><a href="tel:${data.phone.replace(/\s/g, '')}">${data.phone}</a></div>
            </div>
            ` : ''}
            
            ${data.company ? `
            <div class="field">
                <span class="label">Bedrijf:</span>
                <div class="value">${data.company}</div>
            </div>
            ` : ''}
            
            <div class="field">
                <span class="label">Onderwerp:</span>
                <div class="value">${data.subject}</div>
            </div>
            
            ${servicesText ? `
            <div class="field">
                <span class="label">Interesse in diensten:</span>
                <div class="value">${data.services!.join(', ')}</div>
            </div>
            ` : ''}
            
            <div class="field">
                <span class="label">Bericht:</span>
                <div class="message">${data.message}</div>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
                <small style="color: #666;">
                    <strong>Technische informatie:</strong><br>
                    Verstuurd: ${currentDate}<br>
                    ${data.userAgent ? `Browser: ${data.userAgent}<br>` : ''}
                    ${data.referrer ? `Verwezen door: ${data.referrer}` : ''}
                </small>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465</p>
            <p>Dit is een automatisch gegenereerde e-mail van het contactformulier op workflo.nl</p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateContactFormText(data: ContactFormData, servicesText: string): string {
    return `
NIEUW CONTACTFORMULIER - WORKFLO
================================

Naam: ${data.name}
E-mail: ${data.email}
${data.phone ? `Telefoon: ${data.phone}` : ''}
${data.company ? `Bedrijf: ${data.company}` : ''}
Onderwerp: ${data.subject}

${servicesText}

BERICHT:
${data.message}

---
Verstuurd: ${new Date().toLocaleDateString('nl-NL')}
${data.userAgent ? `Browser: ${data.userAgent}` : ''}
${data.referrer ? `Verwezen door: ${data.referrer}` : ''}

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465
`
  }

  private generateConfirmationHtml(data: ContactFormData): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bevestiging contactverzoek - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .highlight { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #f2f400; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .cta { background: #f2f400; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Bericht Ontvangen!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Bedankt voor je contactverzoek</p>
        </div>
        
        <div class="content">
            <p>Beste ${data.name},</p>
            
            <p>We hebben je bericht succesvol ontvangen en zullen zo snel mogelijk reageren.</p>
            
            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">📋 Je contactverzoek:</h3>
                <p><strong>Onderwerp:</strong> ${data.subject}</p>
                <p><strong>Bericht:</strong> ${data.message.length > 100 ? data.message.substring(0, 100) + '...' : data.message}</p>
            </div>
            
            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">⏰ Wat kun je verwachten?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li><strong>Urgente zaken:</strong> Binnen 15 minuten reactie</li>
                    <li><strong>Algemene vragen:</strong> Binnen 4 werkuren</li>
                    <li><strong>Offertes:</strong> Binnen 24 uur</li>
                </ul>
            </div>
            
            <p>Heb je spoed? Bel direct naar <strong><a href="tel:0203080465">020-30 80 465</a></strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://workflo.nl/tevredenheidscheck" class="cta">🔍 Gratis IT-check</a>
            </div>
            
            <p style="margin-top: 30px;">Met vriendelijke groet,<br>
            <strong>Het Workflo Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam</p>
            <p>📞 020-30 80 465 | 📧 <a href="mailto:info@workflo.nl">info@workflo.nl</a> | 🌐 <a href="https://workflo.nl">workflo.nl</a></p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateConfirmationText(data: ContactFormData): string {
    return `
Beste ${data.name},

We hebben je bericht succesvol ontvangen en zullen zo snel mogelijk reageren.

Je contactverzoek:
Onderwerp: ${data.subject}
Bericht: ${data.message.length > 100 ? data.message.substring(0, 100) + '...' : data.message}

Wat kun je verwachten?
- Urgente zaken: Binnen 15 minuten reactie
- Algemene vragen: Binnen 4 werkuren  
- Offertes: Binnen 24 uur

Heb je spoed? Bel direct naar 020-30 80 465

Met vriendelijke groet,
Het Workflo Team

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam
020-30 80 465 | info@workflo.nl | workflo.nl
`
  }

  private generateQuoteRequestHtml(data: QuoteRequestData, servicesText: string): string {
    const currentDate = new Date().toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const urgencyColor = data.urgency === 'high' ? '#dc3545' : data.urgency === 'low' ? '#28a745' : '#ffc107'
    const urgencyText = data.urgency === 'high' ? 'Hoog' : data.urgency === 'low' ? 'Laag' : 'Gemiddeld'

    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuw Offerteverzoek - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; }
        .value { background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #f2f400; }
        .message { background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; white-space: pre-wrap; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .urgent { background: #fff3cd; border-color: #ffeaa7; color: #856404; padding: 12px; border-radius: 4px; margin-bottom: 20px; }
        .urgency-badge { 
          display: inline-block; 
          background: ${urgencyColor}; 
          color: white; 
          padding: 4px 12px; 
          border-radius: 12px; 
          font-size: 12px; 
          font-weight: bold;
          text-transform: uppercase;
        }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px; }
        .service-item { background: #e8f5e8; padding: 8px 12px; border-radius: 4px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💼 Nieuw Offerteverzoek</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Ontvangen op ${currentDate}</p>
            <span class="urgency-badge">Urgentie: ${urgencyText}</span>
        </div>
        
        <div class="content">
            ${data.urgency === 'high' ? 
                '<div class="urgent">🔥 <strong>URGENT VERZOEK!</strong> Deze klant heeft aangegeven dat dit een urgente aanvraag is.</div>' : ''}
            
            <div class="field">
                <span class="label">Naam:</span>
                <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
                <span class="label">E-mail:</span>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            
            ${data.phone ? `
            <div class="field">
                <span class="label">Telefoon:</span>
                <div class="value"><a href="tel:${data.phone.replace(/\s/g, '')}">${data.phone}</a></div>
            </div>
            ` : ''}
            
            ${data.company ? `
            <div class="field">
                <span class="label">Bedrijf:</span>
                <div class="value">${data.company}</div>
            </div>
            ` : ''}
            
            ${data.budget ? `
            <div class="field">
                <span class="label">Budget:</span>
                <div class="value">${data.budget}</div>
            </div>
            ` : ''}
            
            ${data.timeline ? `
            <div class="field">
                <span class="label">Timeline:</span>
                <div class="value">${data.timeline}</div>
            </div>
            ` : ''}
            
            <div class="field">
                <span class="label">Gewenste diensten:</span>
                <div class="services-grid">
                    ${data.services?.map(service => `<div class="service-item">✓ ${service}</div>`).join('') || '<div class="value">Geen diensten opgegeven</div>'}
                </div>
            </div>
            
            <div class="field">
                <span class="label">Beschrijving:</span>
                <div class="message">${data.message}</div>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
                <small style="color: #666;">
                    <strong>Technische informatie:</strong><br>
                    Verstuurd: ${currentDate}<br>
                    ${data.userAgent ? `Browser: ${data.userAgent}<br>` : ''}
                    ${data.referrer ? `Verwezen door: ${data.referrer}` : ''}
                </small>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465</p>
            <p>Dit is een automatisch gegenereerde e-mail van het offerte formulier op workflo.nl</p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateQuoteRequestText(data: QuoteRequestData, servicesText: string): string {
    return `
NIEUW OFFERTEVERZOEK - WORKFLO
===============================

${data.urgency === 'high' ? '🔥 URGENT VERZOEK 🔥' : ''}

Naam: ${data.name}
E-mail: ${data.email}
${data.phone ? `Telefoon: ${data.phone}` : ''}
${data.company ? `Bedrijf: ${data.company}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.timeline ? `Timeline: ${data.timeline}` : ''}
Urgentie: ${data.urgency === 'high' ? 'Hoog' : data.urgency === 'low' ? 'Laag' : 'Gemiddeld'}

${servicesText}

BESCHRIJVING:
${data.message}

---
Verstuurd: ${new Date().toLocaleDateString('nl-NL')}
${data.userAgent ? `Browser: ${data.userAgent}` : ''}
${data.referrer ? `Verwezen door: ${data.referrer}` : ''}

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465
`
  }

  private generateQuoteConfirmationHtml(data: ContactFormData): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bevestiging offerteverzoek - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .highlight { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #f2f400; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .cta { background: #f2f400; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 10px 0; }
        .services-list { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Offerteverzoek Ontvangen!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Bedankt voor je vertrouwen</p>
        </div>
        
        <div class="content">
            <p>Beste ${data.name},</p>
            
            <p>We hebben je offerteverzoek succesvol ontvangen en zijn al aan de slag gegaan met de voorbereiding van jouw gepersonaliseerde offerte.</p>
            
            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">📋 Je offerteverzoek:</h3>
                ${data.services && data.services.length > 0 ? `
                <div class="services-list">
                    <strong>Gewenste diensten:</strong><br>
                    ${data.services.map(service => `• ${service}`).join('<br>')}
                </div>
                ` : ''}
                <p><strong>Beschrijving:</strong> ${data.message.length > 150 ? data.message.substring(0, 150) + '...' : data.message}</p>
            </div>
            
            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">⏰ Wat kun je verwachten?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li><strong>Binnen 2 werkuren:</strong> Persoonlijk telefoontje voor verduidelijking</li>
                    <li><strong>Binnen 24 uur:</strong> Gepersonaliseerde offerte in je mailbox</li>
                    <li><strong>Binnen 48 uur:</strong> Gedetailleerd implementatieplan</li>
                </ul>
            </div>
            
            <p>Heb je spoed of aanvullende vragen? Bel direct naar <strong><a href="tel:0203080465">020-30 80 465</a></strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://workflo.nl/portfolio" class="cta">🔍 Bekijk onze projecten</a>
                <a href="https://workflo.nl/tevredenheidscheck" class="cta">📊 Gratis IT-check</a>
            </div>
            
            <p style="margin-top: 30px;">Met vriendelijke groet,<br>
            <strong>Het Workflo Team</strong></p>
            
            <p style="font-size: 14px; color: #666; border-top: 1px solid #e9ecef; padding-top: 15px; margin-top: 25px;">
                <em>"Wij zorgen ervoor dat technologie jouw bedrijf vooruit helpt, niet tegenhoudt."</em>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam</p>
            <p>📞 020-30 80 465 | 📧 <a href="mailto:info@workflo.nl">info@workflo.nl</a> | 🌐 <a href="https://workflo.nl">workflo.nl</a></p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateQuoteConfirmationText(data: ContactFormData): string {
    return `
Beste ${data.name},

We hebben je offerteverzoek succesvol ontvangen en zijn al aan de slag gegaan met de voorbereiding van jouw gepersonaliseerde offerte.

Je offerteverzoek:
${data.services && data.services.length > 0 ? `
Gewenste diensten:
${data.services.map(service => `- ${service}`).join('\n')}
` : ''}
Beschrijving: ${data.message.length > 150 ? data.message.substring(0, 150) + '...' : data.message}

Wat kun je verwachten?
- Binnen 2 werkuren: Persoonlijk telefoontje voor verduidelijking
- Binnen 24 uur: Gepersonaliseerde offerte in je mailbox  
- Binnen 48 uur: Gedetailleerd implementatieplan

Heb je spoed of aanvullende vragen? Bel direct naar 020-30 80 465

Met vriendelijke groet,
Het Workflo Team

"Wij zorgen ervoor dat technologie jouw bedrijf vooruit helpt, niet tegenhoudt."

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam
020-30 80 465 | info@workflo.nl | workflo.nl
`
  }

  private generateReferralNotificationHtml(data: ReferralFormData): string {
    const currentDate = new Date().toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuwe Referral - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 15px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; font-size: 14px; }
        .value { background: #f8f9fa; padding: 12px; border-radius: 4px; border-left: 4px solid #10b981; }
        .message { background: #f8f9fa; padding: 15px; border-radius: 6px; border: 1px solid #e9ecef; white-space: pre-wrap; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .highlight { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Nieuwe Referral!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Ontvangen op ${currentDate}</p>
        </div>

        <div class="content">
            <div class="highlight">
                <strong>🔥 Hete lead!</strong> ${data.referrerName} heeft ${data.referredCompany} aan ons verwezen.
            </div>

            <div class="section">
                <div class="section-title">Verwijzer (Bestaande Klant)</div>

                <div class="field">
                    <span class="label">Naam:</span>
                    <div class="value">${data.referrerName}</div>
                </div>

                <div class="field">
                    <span class="label">E-mail:</span>
                    <div class="value"><a href="mailto:${data.referrerEmail}">${data.referrerEmail}</a></div>
                </div>

                ${data.referrerPhone ? `
                <div class="field">
                    <span class="label">Telefoon:</span>
                    <div class="value"><a href="tel:${data.referrerPhone.replace(/\s/g, '')}">${data.referrerPhone}</a></div>
                </div>
                ` : ''}

                ${data.referrerCompany ? `
                <div class="field">
                    <span class="label">Bedrijf:</span>
                    <div class="value">${data.referrerCompany}</div>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <div class="section-title">Verwezen Bedrijf (Nieuwe Lead)</div>

                <div class="field">
                    <span class="label">Contactpersoon:</span>
                    <div class="value">${data.referredName}</div>
                </div>

                <div class="field">
                    <span class="label">Bedrijf:</span>
                    <div class="value"><strong>${data.referredCompany}</strong></div>
                </div>

                <div class="field">
                    <span class="label">E-mail:</span>
                    <div class="value"><a href="mailto:${data.referredEmail}">${data.referredEmail}</a></div>
                </div>

                ${data.referredPhone ? `
                <div class="field">
                    <span class="label">Telefoon:</span>
                    <div class="value"><a href="tel:${data.referredPhone.replace(/\s/g, '')}">${data.referredPhone}</a></div>
                </div>
                ` : ''}

                ${data.relationship ? `
                <div class="field">
                    <span class="label">Relatie:</span>
                    <div class="value">${data.relationship}</div>
                </div>
                ` : ''}
            </div>

            ${data.message ? `
            <div class="section">
                <div class="section-title">Aanvullende Informatie</div>
                <div class="message">${data.message}</div>
            </div>
            ` : ''}

            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
                <p><strong>Volgende stappen:</strong></p>
                <ol>
                    <li>Neem binnen 24 uur contact op met ${data.referredName}</li>
                    <li>Referentie: "Verwezen door ${data.referrerName}"</li>
                    <li>Update CRM met referral informatie</li>
                    <li>Informeer ${data.referrerName} over de voortgang</li>
                </ol>
            </div>
        </div>

        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465</p>
            <p>Dit is een automatisch gegenereerde e-mail van het referral formulier op workflo.nl</p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateReferralNotificationText(data: ReferralFormData): string {
    return `
NIEUWE REFERRAL - WORKFLO
=========================

🎉 Hete lead! ${data.referrerName} heeft ${data.referredCompany} aan ons verwezen.

VERWIJZER (BESTAANDE KLANT)
Naam: ${data.referrerName}
E-mail: ${data.referrerEmail}
${data.referrerPhone ? `Telefoon: ${data.referrerPhone}` : ''}
${data.referrerCompany ? `Bedrijf: ${data.referrerCompany}` : ''}

VERWEZEN BEDRIJF (NIEUWE LEAD)
Contactpersoon: ${data.referredName}
Bedrijf: ${data.referredCompany}
E-mail: ${data.referredEmail}
${data.referredPhone ? `Telefoon: ${data.referredPhone}` : ''}
${data.relationship ? `Relatie: ${data.relationship}` : ''}

${data.message ? `AANVULLENDE INFORMATIE:\n${data.message}\n` : ''}

VOLGENDE STAPPEN:
1. Neem binnen 24 uur contact op met ${data.referredName}
2. Referentie: "Verwezen door ${data.referrerName}"
3. Update CRM met referral informatie
4. Informeer ${data.referrerName} over de voortgang

---
Verstuurd: ${new Date().toLocaleDateString('nl-NL')}

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam | 020-30 80 465
`
  }

  private generateReferralThankYouHtml(data: ReferralFormData): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedankt voor je referral - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .highlight { background: #d1fae5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .benefit { background: #f0fdf4; padding: 12px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🙏 Hartelijk Dank!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">We waarderen je vertrouwen</p>
        </div>

        <div class="content">
            <p>Beste ${data.referrerName},</p>

            <p>Wat geweldig dat je <strong>${data.referredCompany}</strong> aan ons hebt verwezen! We waarderen je vertrouwen enorm en zullen er alles aan doen om ook voor hen de beste IT-partner te zijn.</p>

            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">🎁 Jouw Referral Voordelen</h3>
                <div class="benefit">✓ 10% korting op je volgende factuur wanneer de referral klant wordt</div>
                <div class="benefit">✓ Gratis IT-audit ter waarde van €500 na 3 succesvolle referrals</div>
                <div class="benefit">✓ Priority support status</div>
                <div class="benefit">✓ Toegang tot exclusieve partner events</div>
            </div>

            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">📋 Wat gebeurt er nu?</h3>
                <p>We gaan binnen 24 uur contact opnemen met ${data.referredName} van ${data.referredCompany}. We zullen natuurlijk vermelden dat jij ons hebt aanbevolen!</p>
                <p>Je ontvangt van ons een update zodra we contact hebben gehad en bij elke belangrijke stap in het proces.</p>
            </div>

            <p>Ken je nog meer bedrijven die baat zouden hebben bij professionele IT-ondersteuning? We staan altijd open voor nieuwe referrals!</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://workflo.nl/referral" style="background: #10b981; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verwijs nog een bedrijf</a>
            </div>

            <p>Nogmaals ontzettend bedankt voor je vertrouwen en aanbeveling!</p>

            <p style="margin-top: 30px;">Met vriendelijke groet,<br>
            <strong>Het Workflo Team</strong></p>
        </div>

        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam</p>
            <p>📞 020-30 80 465 | 📧 <a href="mailto:info@workflo.nl">info@workflo.nl</a> | 🌐 <a href="https://workflo.nl">workflo.nl</a></p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateReferralThankYouText(data: ReferralFormData): string {
    return `
Beste ${data.referrerName},

Wat geweldig dat je ${data.referredCompany} aan ons hebt verwezen! We waarderen je vertrouwen enorm en zullen er alles aan doen om ook voor hen de beste IT-partner te zijn.

JOUW REFERRAL VOORDELEN
- 10% korting op je volgende factuur wanneer de referral klant wordt
- Gratis IT-audit ter waarde van €500 na 3 succesvolle referrals
- Priority support status
- Toegang tot exclusieve partner events

WAT GEBEURT ER NU?
We gaan binnen 24 uur contact opnemen met ${data.referredName} van ${data.referredCompany}. We zullen natuurlijk vermelden dat jij ons hebt aanbevolen!

Je ontvangt van ons een update zodra we contact hebben gehad en bij elke belangrijke stap in het proces.

Ken je nog meer bedrijven die baat zouden hebben bij professionele IT-ondersteuning? We staan altijd open voor nieuwe referrals!

Nogmaals ontzettend bedankt voor je vertrouwen en aanbeveling!

Met vriendelijke groet,
Het Workflo Team

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam
020-30 80 465 | info@workflo.nl | workflo.nl
`
  }

  private generateReferralIntroductionHtml(data: ReferralFormData): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Persoonlijke aanbeveling van ${data.referrerName} - Workflo</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .highlight { background: #fffbeb; padding: 20px; border-radius: 6px; border-left: 4px solid #f2f400; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .cta { background: #f2f400; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 10px 0; }
        .feature { background: #f8f9fa; padding: 12px; border-radius: 4px; margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👋 Kennismaking via ${data.referrerName}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Persoonlijke IT-partner aanbeveling</p>
        </div>

        <div class="content">
            <p>Beste ${data.referredName},</p>

            <div class="highlight">
                <p><strong>${data.referrerName}</strong> ${data.referrerCompany ? `van ${data.referrerCompany}` : ''} heeft Workflo aan je aanbevolen als betrouwbare IT-partner voor ${data.referredCompany}.</p>
            </div>

            <p>Bij Workflo zorgen we ervoor dat IT jouw bedrijf vooruit helpt in plaats van tegenhoudt. We begrijpen dat elke organisatie unieke IT-uitdagingen heeft, en daarom bieden we maatwerk oplossingen die perfect aansluiten bij jouw situatie.</p>

            <h3 style="color: #333; margin-top: 25px;">Waarom kiezen klanten voor Workflo?</h3>

            <div class="feature">✓ <strong>Proactieve aanpak:</strong> We lossen problemen op voordat ze ontstaan</div>
            <div class="feature">✓ <strong>Vaste contactpersoon:</strong> Geen callcenter, maar een dedicated team</div>
            <div class="feature">✓ <strong>Transparante prijzen:</strong> Geen verborgen kosten</div>
            <div class="feature">✓ <strong>24/7 monitoring:</strong> We houden alles in de gaten</div>
            <div class="feature">✓ <strong>Snelle response:</strong> Gemiddeld binnen 1 uur</div>
            <div class="feature">✓ <strong>Amsterdam-based:</strong> Lokale service, persoonlijk contact</div>

            <div class="highlight">
                <h3 style="margin: 0 0 10px 0;">🎁 Speciale Referral Actie</h3>
                <p>Als verwezen bedrijf krijg je van ons:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Gratis IT-audit</strong> ter waarde van €500</li>
                    <li><strong>10% korting</strong> op de eerste 3 maanden</li>
                    <li><strong>Gratis on-site assessment</strong> van je huidige IT-infrastructuur</li>
                    <li><strong>Persoonlijk strategisch IT-plan</strong> voor jouw organisatie</li>
                </ul>
            </div>

            <p>Ik zou graag kennismaken en bespreken hoe we ${data.referredCompany} kunnen helpen met professionele IT-ondersteuning. Wanneer komt het jou uit voor een vrijblijvend gesprek?</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://workflo.nl/afspraak" class="cta">📅 Plan een kennismaking</a>
                <br><br>
                <p style="margin: 10px 0;">Of bel direct: <strong><a href="tel:0203080465" style="color: #000;">020-30 80 465</a></strong></p>
            </div>

            <p style="margin-top: 30px;">Ik kijk uit naar ons gesprek!</p>

            <p style="margin-top: 30px;">Met vriendelijke groet,<br>
            <strong>Het Workflo Team</strong></p>

            <p style="font-size: 12px; color: #666; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                <em>P.S. ${data.referrerName} is al enige tijd tevreden klant bij ons. Mocht je vragen hebben over hun ervaring, neem gerust contact op!</em>
            </p>
        </div>

        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam</p>
            <p>📞 020-30 80 465 | 📧 <a href="mailto:info@workflo.nl">info@workflo.nl</a> | 🌐 <a href="https://workflo.nl">workflo.nl</a></p>
        </div>
    </div>
</body>
</html>
`
  }

  private generateReferralIntroductionText(data: ReferralFormData): string {
    return `
Beste ${data.referredName},

${data.referrerName} ${data.referrerCompany ? `van ${data.referrerCompany}` : ''} heeft Workflo aan je aanbevolen als betrouwbare IT-partner voor ${data.referredCompany}.

Bij Workflo zorgen we ervoor dat IT jouw bedrijf vooruit helpt in plaats van tegenhoudt. We begrijpen dat elke organisatie unieke IT-uitdagingen heeft, en daarom bieden we maatwerk oplossingen die perfect aansluiten bij jouw situatie.

WAAROM KIEZEN KLANTEN VOOR WORKFLO?
- Proactieve aanpak: We lossen problemen op voordat ze ontstaan
- Vaste contactpersoon: Geen callcenter, maar een dedicated team
- Transparante prijzen: Geen verborgen kosten
- 24/7 monitoring: We houden alles in de gaten
- Snelle response: Gemiddeld binnen 1 uur
- Amsterdam-based: Lokale service, persoonlijk contact

SPECIALE REFERRAL ACTIE
Als verwezen bedrijf krijg je van ons:
- Gratis IT-audit ter waarde van €500
- 10% korting op de eerste 3 maanden
- Gratis on-site assessment van je huidige IT-infrastructuur
- Persoonlijk strategisch IT-plan voor jouw organisatie

Ik zou graag kennismaken en bespreken hoe we ${data.referredCompany} kunnen helpen met professionele IT-ondersteuning. Wanneer komt het jou uit voor een vrijblijvend gesprek?

Plan een kennismaking: https://workflo.nl/afspraak
Of bel direct: 020-30 80 465

Ik kijk uit naar ons gesprek!

Met vriendelijke groet,
Het Workflo Team

P.S. ${data.referrerName} is al enige tijd tevreden klant bij ons. Mocht je vragen hebben over hun ervaring, neem gerust contact op!

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam
020-30 80 465 | info@workflo.nl | workflo.nl
`
  }
}

export const emailService = new EmailService()
export default emailService