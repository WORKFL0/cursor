import { jsPDF } from 'jspdf'
import type { PricingQuote } from '@/lib/data/pricing-data'
import { serviceCategories } from '@/lib/data/pricing-data'
import { companyInfo } from '@/lib/data/workflo-data'

interface PDFQuoteOptions {
  quote: PricingQuote
  isYearly: boolean
  language: 'nl' | 'en'
}

export function generateQuotePDF({ quote, isYearly, language }: PDFQuoteOptions): Blob {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Colors
  const primaryColor = '#f2f400' // Workflo yellow
  const textColor = '#1f2937'
  const lightGray = '#6b7280'

  // Helper function to add text with word wrapping
  function addText(text: string, x: number, y: number, options: any = {}) {
    const { fontSize = 10, color = textColor, fontStyle = 'normal', maxWidth = pageWidth - 40 } = options
    
    doc.setFontSize(fontSize)
    doc.setTextColor(color)
    doc.setFont('helvetica', fontStyle)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.5)
  }

  // Header
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  // Company logo/name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Workflo', 20, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(language === 'nl' ? 'IT-diensten Offerte' : 'IT Services Quote', 20, 32)
  
  // Quote ID and Date
  doc.setFontSize(10)
  doc.text(`${language === 'nl' ? 'Offerte' : 'Quote'} #${quote.id}`, pageWidth - 60, 25)
  doc.text(new Date().toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US'), pageWidth - 60, 32)

  yPosition = 60

  // Company Information
  yPosition = addText('Workflo B.V.', 20, yPosition, { fontSize: 14, fontStyle: 'bold', color: textColor })
  yPosition = addText(companyInfo.location.address, 20, yPosition + 5, { color: lightGray })
  yPosition = addText(`${companyInfo.location.postalCode} ${companyInfo.location.city}`, 20, yPosition + 3, { color: lightGray })
  yPosition = addText(`${language === 'nl' ? 'Tel:' : 'Phone:'} ${companyInfo.location.phone}`, 20, yPosition + 3, { color: lightGray })
  yPosition = addText(`${language === 'nl' ? 'E-mail:' : 'Email:'} ${companyInfo.location.email}`, 20, yPosition + 3, { color: lightGray })

  yPosition += 20

  // Quote Title
  yPosition = addText(
    language === 'nl' ? 'Offerte voor IT-diensten' : 'Quote for IT Services', 
    20, 
    yPosition, 
    { fontSize: 18, fontStyle: 'bold', color: primaryColor }
  )

  yPosition += 10

  // Services Table Header
  doc.setFillColor(245, 245, 245)
  doc.rect(20, yPosition, pageWidth - 40, 15, 'F')
  
  doc.setTextColor(textColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'nl' ? 'Service' : 'Service', 25, yPosition + 10)
  doc.text(language === 'nl' ? 'Aantal' : 'Quantity', pageWidth - 100, yPosition + 10)
  doc.text(language === 'nl' ? 'Prijs' : 'Price', pageWidth - 50, yPosition + 10)

  yPosition += 20

  // Services List
  let subtotal = 0
  doc.setFont('helvetica', 'normal')
  
  quote.services.forEach((quoteService) => {
    const service = serviceCategories.find(s => s.id === quoteService.serviceId)
    if (!service) return

    const serviceName = language === 'nl' ? service.nameNL : service.name
    const servicePrice = isYearly ? quoteService.yearlyPrice : quoteService.monthlyPrice
    const unit = language === 'nl' ? service.unitNL : service.unit
    
    subtotal += servicePrice

    // Service row
    yPosition = addText(serviceName, 25, yPosition + 5, { fontSize: 10 })
    doc.text(`${quoteService.quantity} ${unit}`, pageWidth - 100, yPosition - 2)
    doc.text(`€${servicePrice.toFixed(2)}`, pageWidth - 50, yPosition - 2)
    
    // Add line
    doc.setDrawColor(230, 230, 230)
    doc.line(20, yPosition + 3, pageWidth - 20, yPosition + 3)
    
    yPosition += 8
  })

  yPosition += 10

  // Subtotal
  doc.setFont('helvetica', 'bold')
  doc.text(language === 'nl' ? 'Subtotaal:' : 'Subtotal:', pageWidth - 100, yPosition)
  doc.text(`€${subtotal.toFixed(2)}`, pageWidth - 50, yPosition)

  yPosition += 10

  // Discount (if yearly)
  if (isYearly && quote.yearlyDiscount > 0) {
    doc.setTextColor(34, 197, 94) // Green color
    doc.text(language === 'nl' ? 'Jaarlijkse korting:' : 'Annual discount:', pageWidth - 100, yPosition)
    doc.text(`-€${quote.yearlyDiscount.toFixed(2)}`, pageWidth - 50, yPosition)
    yPosition += 10
  }

  // Total
  doc.setFillColor(primaryColor)
  doc.rect(pageWidth - 120, yPosition - 5, 100, 15, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  const totalPrice = isYearly ? quote.totalYearly : quote.totalMonthly
  doc.text(language === 'nl' ? 'Totaal:' : 'Total:', pageWidth - 110, yPosition + 5)
  doc.text(`€${totalPrice.toFixed(2)}`, pageWidth - 50, yPosition + 5)

  yPosition += 25

  // Period and validity
  doc.setTextColor(textColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const period = isYearly ? (language === 'nl' ? 'per jaar' : 'per year') : (language === 'nl' ? 'per maand' : 'per month')
  yPosition = addText(`${language === 'nl' ? 'Prijzen zijn' : 'Prices are'} ${period}`, 20, yPosition)
  
  yPosition += 5
  yPosition = addText(
    `${language === 'nl' ? 'Deze offerte is geldig tot' : 'This quote is valid until'}: ${quote.expiresAt.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US')}`, 
    20, 
    yPosition
  )

  yPosition += 20

  // Terms and conditions
  yPosition = addText(
    language === 'nl' ? 'Algemene voorwaarden:' : 'Terms and conditions:', 
    20, 
    yPosition, 
    { fontSize: 12, fontStyle: 'bold' }
  )

  const terms = language === 'nl' ? [
    '• Alle prijzen zijn exclusief 21% BTW',
    '• Betaling binnen 30 dagen na factuurdatum',
    '• Services worden geactiveerd na ontvangst van ondertekende overeenkomst',
    '• Setup kosten kunnen van toepassing zijn',
    '• Voor meer informatie zie onze algemene voorwaarden op workflo.it'
  ] : [
    '• All prices exclude 21% VAT',
    '• Payment within 30 days of invoice date',
    '• Services will be activated after receipt of signed agreement',
    '• Setup costs may apply',
    '• For more information see our terms and conditions at workflo.it'
  ]

  terms.forEach(term => {
    yPosition += 8
    yPosition = addText(term, 20, yPosition, { fontSize: 9, color: lightGray })
  })

  // Footer
  const footerY = pageHeight - 30
  doc.setDrawColor(primaryColor)
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10)
  
  doc.setTextColor(lightGray)
  doc.setFontSize(8)
  doc.text('Workflo B.V. | Amsterdam | workflo.it', 20, footerY)
  doc.text(`${language === 'nl' ? 'Pagina' : 'Page'} 1`, pageWidth - 30, footerY)

  // Convert to blob
  const pdfBlob = doc.output('blob')
  return pdfBlob
}

export function downloadQuotePDF(options: PDFQuoteOptions): void {
  const pdfBlob = generateQuotePDF(options)
  const url = URL.createObjectURL(pdfBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `workflo-quote-${options.quote.id}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}