'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  AlertCircle, 
  CheckCircle, 
  Send, 
  Loader2, 
  Shield,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Building,
  User,
  FileText,
  Clock,
  Euro,
  Zap
} from 'lucide-react'
import { FormValidator, FormUtils, ValidationResult } from '@/lib/utils/form-validation'
import { analyticsService } from '@/lib/services/analytics-service'

export type FormType = 'contact' | 'quote' | 'newsletter'

export interface FormField {
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'multi-select'
  label: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  icon?: React.ReactNode
  description?: string
  maxLength?: number
}

export interface FormConfig {
  type: FormType
  title: string
  description: string
  fields: FormField[]
  submitButtonText: string
  successMessage: string
  validator: FormValidator
  apiEndpoint: string
}

export interface WorkfloFormProps {
  config: FormConfig
  className?: string
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
  showPrivacyNotice?: boolean
  enableProgressIndicator?: boolean
}

interface SubmissionState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage: string
  successData?: any
}

export function WorkfloForm({
  config,
  className = '',
  onSubmitSuccess,
  onSubmitError,
  showPrivacyNotice = true,
  enableProgressIndicator = true
}: WorkfloFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: {} })
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [submission, setSubmission] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  })
  const [showValidation, setShowValidation] = useState(false)
  const [honeypotValue, setHoneypotValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Form progress calculation
  const filledFields = config.fields.filter(field => {
    const value = formData[field.name]
    if (field.type === 'multi-select' && Array.isArray(value)) {
      return value.length > 0
    }
    return value && String(value).trim().length > 0
  }).length

  const progressPercentage = Math.round((filledFields / config.fields.filter(f => f.required).length) * 100)

  // Real-time validation with analytics
  useEffect(() => {
    if (showValidation) {
      const validationResult = config.validator.validate(formData)
      setValidation(validationResult)
      
      // Track validation errors for analytics
      Object.entries(validationResult.errors).forEach(([fieldName, error]) => {
        if (touchedFields.has(fieldName)) {
          analyticsService.trackFormValidationError(config.type, fieldName, 'validation_error')
        }
      })
    }
  }, [formData, config.validator, showValidation, touchedFields, config.type])

  // Handle field changes
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))

    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, fieldName]))
  }, [])

  // Handle field blur for validation
  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set([...prev, fieldName]))
    
    if (!showValidation) {
      setShowValidation(true)
    }
  }, [showValidation])

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Enable validation display
    setShowValidation(true)
    
    // Validate form
    const validationResult = config.validator.validate(formData)
    setValidation(validationResult)

    if (!validationResult.isValid) {
      // Focus on first error field
      const firstErrorField = config.fields.find(field => validationResult.errors[field.name])
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField.name}"]`) as HTMLElement
        element?.focus()
      }
      return
    }

    // Honeypot check
    if (honeypotValue) {
      console.warn('Honeypot triggered, potential spam')
      setSubmission({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: ''
      })
      return
    }

    setSubmission({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    })

    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        honeypot: honeypotValue,
        language: language,
        timestamp: new Date().toISOString(),
        formType: config.type
      }

      // Sanitize text inputs
      Object.keys(submissionData).forEach(key => {
        if (typeof (submissionData as any)[key] === 'string') {
          (submissionData as any)[key] = FormUtils.sanitizeInput((submissionData as any)[key])
        }
      })

      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Er ging iets mis bij het verzenden.')
      }

      // Success
      setSubmission({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: '',
        successData: result
      })

      // Reset form
      setFormData({})
      setTouchedFields(new Set())
      setShowValidation(false)

      // Call success callback
      onSubmitSuccess?.(result)

      // Track analytics
      analyticsService.trackFormSubmission({
        formType: config.type,
        success: true,
        hubspotIntegrated: result.details?.hubspotSubmitted || result.details?.hubspotIntegrated,
        fallbackUsed: result.details?.fallbackUsed,
        services: (submissionData as any).services,
        timestamp: submissionData.timestamp
      })

      // Track conversion
      analyticsService.trackConversion(config.type)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden.'
      
      setSubmission({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage
      })

      onSubmitError?.(errorMessage)

      // Track error analytics
      analyticsService.trackFormSubmission({
        formType: config.type,
        success: false,
        errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Render field based on type
  const renderField = (field: FormField) => {
    const hasError = showValidation && validation.errors[field.name] && touchedFields.has(field.name)
    const hasWarning = showValidation && validation.warnings?.[field.name] && touchedFields.has(field.name)
    const value = formData[field.name] || ''

    const fieldId = `${config.type}-${field.name}`

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-2">
              {field.icon}
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              name={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              className={`${hasError ? 'border-red-500 focus:border-red-500' : ''} ${hasWarning ? 'border-yellow-500' : ''}`}
              maxLength={field.maxLength}
              aria-invalid={hasError ? 'true' : undefined}
              aria-describedby={hasError ? `${fieldId}-error` : hasWarning ? `${fieldId}-warning` : undefined}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.p
                  id={`${fieldId}-error`}
                  className="text-sm text-red-600 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {validation.errors[field.name]}
                </motion.p>
              )}
              {hasWarning && !hasError && (
                <motion.p
                  id={`${fieldId}-warning`}
                  className="text-sm text-yellow-600 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {validation.warnings![field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-2">
              {field.icon}
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              name={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              className={`min-h-[120px] ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${hasWarning ? 'border-yellow-500' : ''}`}
              maxLength={field.maxLength}
              aria-invalid={hasError ? 'true' : undefined}
            />
            <div className="flex justify-between items-center">
              <div>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <AnimatePresence mode="wait">
                  {hasError && (
                    <motion.p
                      className="text-sm text-red-600 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      {validation.errors[field.name]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              {field.maxLength && (
                <p className="text-sm text-muted-foreground">
                  {value.length}/{field.maxLength}
                </p>
              )}
            </div>
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId} className="flex items-center gap-2">
              {field.icon}
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(value) => handleFieldChange(field.name, value)}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AnimatePresence>
              {hasError && (
                <motion.p
                  className="text-sm text-red-600 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {validation.errors[field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )

      case 'multi-select':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div key={field.name} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.icon}
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldId}-${option.value}`}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value)
                      handleFieldChange(field.name, newValues)
                    }}
                  />
                  <Label
                    htmlFor={`${fieldId}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {hasError && (
                <motion.p
                  className="text-sm text-red-600 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {validation.errors[field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )

      default:
        return null
    }
  }

  // Initialize form analytics tracking
  useEffect(() => {
    if (formRef.current && !submission.isSuccess) {
      analyticsService.initializeFormTracking(config.type, formRef.current)
    }
  }, [config.type, submission.isSuccess])

  // Reset form after success
  useEffect(() => {
    if (submission.isSuccess) {
      const timer = setTimeout(() => {
        setSubmission(prev => ({ ...prev, isSuccess: false }))
      }, 10000) // Hide success message after 10 seconds

      return () => clearTimeout(timer)
    }
    return undefined
  }, [submission.isSuccess])

  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.title}
        </CardTitle>
        <p className="text-muted-foreground">{config.description}</p>
        
        {enableProgressIndicator && filledFields > 0 && !submission.isSuccess && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Voortgang</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-workflo-yellow h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {submission.isSuccess ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Succesvol verzonden!</h3>
              <p className="text-muted-foreground mb-6">{config.successMessage}</p>
              
              {submission.successData?.details && (
                <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {submission.successData.details.emailSent && (
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <Mail className="w-4 h-4" />
                        <span>E-mail verzonden</span>
                      </div>
                    )}
                    {submission.successData.details.hubspotSubmitted && (
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <Building className="w-4 h-4" />
                        <span>CRM bijgewerkt</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setSubmission({ isSubmitting: false, isSuccess: false, isError: false, errorMessage: '' })}
                variant="outline"
                className="mt-4"
              >
                Nieuw formulier
              </Button>
            </motion.div>
          ) : (
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Honeypot field */}
              <input
                type="text"
                name={FormUtils.getHoneypotFieldName()}
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                style={{ 
                  position: 'absolute', 
                  left: '-9999px', 
                  width: '1px', 
                  height: '1px', 
                  opacity: 0,
                  pointerEvents: 'none'
                }}
                tabIndex={-1}
                autoComplete="off"
              />

              {config.fields.map(renderField)}

              {showPrivacyNotice && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Privacy & Beveiliging</p>
                      <p>
                        Je gegevens worden beveiligd verzonden en gebruikt voor het verwerken van je aanvraag. 
                        We delen je informatie niet met derden en je kunt je gegevens altijd laten verwijderen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submission.isError && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">Er ging iets mis</p>
                  </div>
                  <p className="text-red-600 mt-1">{submission.errorMessage}</p>
                </motion.div>
              )}

              <Button
                ref={submitButtonRef}
                type="submit"
                disabled={submission.isSubmitting || (!showValidation ? false : !validation.isValid)}
                className="w-full bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-semibold py-3"
              >
                {submission.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {config.submitButtonText}
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}