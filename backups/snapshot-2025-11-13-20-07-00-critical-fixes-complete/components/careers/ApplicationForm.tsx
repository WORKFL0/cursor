'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Send, Upload, X } from 'lucide-react'

interface ApplicationFormProps {
  position: string
  onClose?: () => void
}

export default function ApplicationForm({ position, onClose }: ApplicationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    motivation: '',
    experience: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      title: "Sollicitatie verstuurd!",
      description: "We nemen zo snel mogelijk contact met je op.",
    })

    setIsSubmitting(false)
    if (onClose) onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0])
    }
  }

  return (
    <div className="bg-card rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Solliciteer voor</h2>
          <p className="text-primary-600 font-medium mt-1">{position}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Volledige naam *</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jan Jansen"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mailadres *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jan@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Telefoonnummer *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+31 6 12345678"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn Profiel</Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedIn}
              onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cv">CV uploaden *</Label>
          <div className="mt-1">
            <label
              htmlFor="cv"
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                {cvFile ? cvFile.name : 'Klik om CV te uploaden (PDF, max 5MB)'}
              </span>
              <input
                id="cv"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="motivation">Motivatie *</Label>
          <Textarea
            id="motivation"
            required
            rows={4}
            value={formData.motivation}
            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            placeholder="Waarom wil je bij Workflo werken?"
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="experience">Relevante ervaring</Label>
          <Textarea
            id="experience"
            rows={4}
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="Beschrijf kort je relevante werkervaring..."
            className="resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
            variant="workflo"
          >
            {isSubmitting ? (
              <>Verzenden...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Verstuur Sollicitatie
              </>
            )}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}