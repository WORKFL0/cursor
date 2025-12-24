'use client'

import { Button } from '@/components/ui/button'
import { NewsletterModal, useNewsletterModal } from '@/components/modals/newsletter-modal'

export function BlogNewsletterCTA() {
  const { isOpen, open, close } = useNewsletterModal()

  return (
    <>
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Blijf op de hoogte</h2>
          <p className="text-xl opacity-90 mb-8">
            Ontvang onze nieuwste artikelen en IT tips direct in je inbox
          </p>
          <Button onClick={open} size="lg" variant="secondary">
            Aanmelden voor nieuwsbrief
          </Button>
        </div>
      </section>

      <NewsletterModal isOpen={isOpen} onClose={close} />
    </>
  )
}
