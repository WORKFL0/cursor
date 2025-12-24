'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ShareButtonsProps {
  slug: string
  title: string
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const url = `https://workflo.it/blog/${slug}`

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank'
    )
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    alert('Link gekopieerd!')
  }

  return (
    <Card className="mb-12">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Deel dit artikel:</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnLinkedIn}
            >
              <Share2 className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Kopieer link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
