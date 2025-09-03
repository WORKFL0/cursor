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
}

export const emailService = new EmailService()
export default emailService