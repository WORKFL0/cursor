import { Metadata } from 'next'
import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'
import { testimonials } from '@/lib/data/testimonials-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Testimonials | Workflo',
  description: 'Read what our clients say about Workflo IT services and support.',
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-muted/50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Client Success Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover why businesses across Amsterdam trust Workflo for their IT needs
            </p>
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel testimonials={testimonials.filter(t => t.featured)} />
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            All Client Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your IT?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied businesses that trust Workflo with their technology needs
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-card text-foreground hover:bg-muted">
              <Link href="/tevredenheidscheck">Take IT Health Check</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}