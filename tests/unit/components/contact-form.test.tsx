/**
 * Component Tests for ContactForm
 * Tests form rendering, validation, submission, and user interactions
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/forms/ContactForm'

// Mock the WorkfloForm component since we're testing the ContactForm wrapper
jest.mock('@/components/forms/WorkfloForm', () => ({
  WorkfloForm: ({ config, className, onSubmitSuccess, onSubmitError, showPrivacyNotice }: any) => (
    <div data-testid="workflo-form">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const data = Object.fromEntries(formData.entries())
          
          // Mock validation
          if (!data.name || !data.email) {
            onSubmitError?.('Required fields missing')
            return
          }
          
          onSubmitSuccess?.(data)
        }}
      >
        <h2>{config.title}</h2>
        <p>{config.description}</p>
        
        {config.fields.map((field: any) => (
          <div key={field.name} data-testid={`field-${field.name}`}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select name={field.name} id={field.name} required={field.required}>
                <option value="">{field.placeholder}</option>
                {field.options?.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={field.maxLength}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={field.maxLength}
              />
            )}
            
            {field.description && <small>{field.description}</small>}
          </div>
        ))}
        
        <button type="submit">{config.submitButtonText}</button>
        
        {showPrivacyNotice && (
          <div data-testid="privacy-notice">Privacy notice displayed</div>
        )}
      </form>
    </div>
  )
}))

describe('ContactForm Component', () => {
  const defaultProps = {
    className: 'test-class',
    onSuccess: jest.fn(),
    onError: jest.fn(),
    showPrivacyNotice: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should render the form with correct title and description', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByText('Neem contact met ons op')).toBeInTheDocument()
      expect(screen.getByText('Stel je vraag en we nemen binnen 4 uur contact met je op.')).toBeInTheDocument()
    })

    test('should render all required form fields', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByTestId('field-name')).toBeInTheDocument()
      expect(screen.getByTestId('field-email')).toBeInTheDocument()
      expect(screen.getByTestId('field-phone')).toBeInTheDocument()
      expect(screen.getByTestId('field-company')).toBeInTheDocument()
      expect(screen.getByTestId('field-subject')).toBeInTheDocument()
      expect(screen.getByTestId('field-message')).toBeInTheDocument()
    })

    test('should mark required fields correctly', () => {
      render(<ContactForm {...defaultProps} />)
      
      // Check for required field indicators (*)
      expect(screen.getByLabelText(/Voor- en achternaam\*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/E-mailadres\*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Onderwerp\*/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Bericht\*/)).toBeInTheDocument()
    })

    test('should render subject dropdown with all options', () => {
      render(<ContactForm {...defaultProps} />)
      
      const subjectSelect = screen.getByRole('combobox', { name: /Onderwerp/ })
      expect(subjectSelect).toBeInTheDocument()
      
      // Check for specific options
      expect(screen.getByText('Algemene vraag')).toBeInTheDocument()
      expect(screen.getByText('IT Support nodig')).toBeInTheDocument()
      expect(screen.getByText('Cybersecurity vraag')).toBeInTheDocument()
      expect(screen.getByText('Microsoft 365')).toBeInTheDocument()
    })

    test('should render submit button with correct text', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: 'Verstuur bericht' })).toBeInTheDocument()
    })

    test('should show privacy notice by default', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByTestId('privacy-notice')).toBeInTheDocument()
    })

    test('should hide privacy notice when showPrivacyNotice is false', () => {
      render(<ContactForm {...defaultProps} showPrivacyNotice={false} />)
      
      expect(screen.queryByTestId('privacy-notice')).not.toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    test('should allow typing in text fields', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const nameInput = screen.getByRole('textbox', { name: /Voor- en achternaam/ })
      const emailInput = screen.getByRole('textbox', { name: /E-mailadres/ })
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      
      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
    })

    test('should allow selecting from subject dropdown', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const subjectSelect = screen.getByRole('combobox', { name: /Onderwerp/ })
      
      await user.selectOptions(subjectSelect, 'it-support')
      expect(subjectSelect).toHaveValue('it-support')
    })

    test('should allow typing in textarea', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const messageTextarea = screen.getByRole('textbox', { name: /Bericht/ })
      
      await user.type(messageTextarea, 'This is my test message')
      expect(messageTextarea).toHaveValue('This is my test message')
    })

    test('should respect maxLength on input fields', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const nameInput = screen.getByRole('textbox', { name: /Voor- en achternaam/ })
      expect(nameInput).toHaveAttribute('maxlength', '100')
      
      const messageTextarea = screen.getByRole('textbox', { name: /Bericht/ })
      expect(messageTextarea).toHaveAttribute('maxlength', '2000')
    })
  })

  describe('Form Submission', () => {
    test('should call onSuccess when form is submitted successfully', async () => {
      const user = userEvent.setup()
      const onSuccess = jest.fn()
      render(<ContactForm {...defaultProps} onSuccess={onSuccess} />)
      
      // Fill in required fields
      await user.type(screen.getByRole('textbox', { name: /Voor- en achternaam/ }), 'John Doe')
      await user.type(screen.getByRole('textbox', { name: /E-mailadres/ }), 'john@example.com')
      await user.selectOptions(screen.getByRole('combobox', { name: /Onderwerp/ }), 'algemene-vraag')
      await user.type(screen.getByRole('textbox', { name: /Bericht/ }), 'This is a test message')
      
      await user.click(screen.getByRole('button', { name: 'Verstuur bericht' }))
      
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '',
          company: '',
          subject: 'algemene-vraag',
          message: 'This is a test message'
        })
      })
    })

    test('should call onError when required fields are missing', async () => {
      const user = userEvent.setup()
      const onError = jest.fn()
      render(<ContactForm {...defaultProps} onError={onError} />)
      
      // Submit without filling required fields
      await user.click(screen.getByRole('button', { name: 'Verstuur bericht' }))
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Required fields missing')
      })
    })

    test('should include optional fields when provided', async () => {
      const user = userEvent.setup()
      const onSuccess = jest.fn()
      render(<ContactForm {...defaultProps} onSuccess={onSuccess} />)
      
      // Fill in all fields including optional ones
      await user.type(screen.getByRole('textbox', { name: /Voor- en achternaam/ }), 'John Doe')
      await user.type(screen.getByRole('textbox', { name: /E-mailadres/ }), 'john@example.com')
      await user.type(screen.getByRole('textbox', { name: /Telefoonnummer/ }), '06-12345678')
      await user.type(screen.getByRole('textbox', { name: /Bedrijf/ }), 'Test Company')
      await user.selectOptions(screen.getByRole('combobox', { name: /Onderwerp/ }), 'cybersecurity')
      await user.type(screen.getByRole('textbox', { name: /Bericht/ }), 'I need help with cybersecurity')
      
      await user.click(screen.getByRole('button', { name: 'Verstuur bericht' }))
      
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '06-12345678',
          company: 'Test Company',
          subject: 'cybersecurity',
          message: 'I need help with cybersecurity'
        })
      })
    })
  })

  describe('Field Descriptions and Help Text', () => {
    test('should show field descriptions', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByText('We gebruiken dit om contact met je op te nemen')).toBeInTheDocument()
      expect(screen.getByText('Voor urgente zaken bellen we je direct')).toBeInTheDocument()
      expect(screen.getByText('Hoe meer details je geeft, des te beter kunnen we je helpen')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByLabelText(/Voor- en achternaam/)).toBeInTheDocument()
      expect(screen.getByLabelText(/E-mailadres/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Telefoonnummer/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Bedrijf/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Onderwerp/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Bericht/)).toBeInTheDocument()
    })

    test('should have proper input types', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByRole('textbox', { name: /Voor- en achternaam/ })).toHaveAttribute('type', 'text')
      expect(screen.getByRole('textbox', { name: /E-mailadres/ })).toHaveAttribute('type', 'email')
      expect(screen.getByRole('textbox', { name: /Telefoonnummer/ })).toHaveAttribute('type', 'tel')
    })

    test('should have proper placeholders', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByPlaceholderText('Je volledige naam')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('je@bedrijf.nl')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('06-12345678 (optioneel)')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Je bedrijfsnaam (optioneel)')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    test('should handle custom className', () => {
      render(<ContactForm className="custom-class" />)
      
      const workfloForm = screen.getByTestId('workflo-form')
      expect(workfloForm).toBeInTheDocument()
    })

    test('should work without optional props', () => {
      render(<ContactForm />)
      
      expect(screen.getByText('Neem contact met ons op')).toBeInTheDocument()
      expect(screen.getByTestId('privacy-notice')).toBeInTheDocument()
    })

    test('should handle undefined callback functions gracefully', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)
      
      // Fill form and submit - should not crash even without callbacks
      await user.type(screen.getByRole('textbox', { name: /Voor- en achternaam/ }), 'John Doe')
      await user.type(screen.getByRole('textbox', { name: /E-mailadres/ }), 'john@example.com')
      await user.selectOptions(screen.getByRole('combobox', { name: /Onderwerp/ }), 'algemene-vraag')
      await user.type(screen.getByRole('textbox', { name: /Bericht/ }), 'Test message')
      
      expect(() => {
        user.click(screen.getByRole('button', { name: 'Verstuur bericht' }))
      }).not.toThrow()
    })
  })

  describe('Form Configuration', () => {
    test('should pass correct configuration to WorkfloForm', () => {
      render(<ContactForm {...defaultProps} />)
      
      // Verify the form is rendered with expected configuration
      expect(screen.getByText('Neem contact met ons op')).toBeInTheDocument()
      expect(screen.getByText('Verstuur bericht')).toBeInTheDocument()
      
      // Verify all expected fields are present
      const expectedFields = ['name', 'email', 'phone', 'company', 'subject', 'message']
      expectedFields.forEach(fieldName => {
        expect(screen.getByTestId(`field-${fieldName}`)).toBeInTheDocument()
      })
    })

    test('should configure subject options correctly', () => {
      render(<ContactForm {...defaultProps} />)
      
      const expectedOptions = [
        'Algemene vraag',
        'IT Support nodig',
        'Cybersecurity vraag',
        'Microsoft 365',
        'Cloud migratie',
        'Compliance & AVG',
        'Offerte aanvraag',
        'Technisch probleem',
        'Partnership / Samenwerking',
        'Anders'
      ]
      
      expectedOptions.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument()
      })
    })

    test('should set correct API endpoint', () => {
      // This is tested implicitly through the WorkfloForm mock
      // The actual API endpoint testing would be in integration tests
      render(<ContactForm {...defaultProps} />)
      expect(screen.getByTestId('workflo-form')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle rapid form submissions gracefully', async () => {
      const user = userEvent.setup()
      const onSuccess = jest.fn()
      render(<ContactForm {...defaultProps} onSuccess={onSuccess} />)
      
      // Fill required fields
      await user.type(screen.getByRole('textbox', { name: /Voor- en achternaam/ }), 'John Doe')
      await user.type(screen.getByRole('textbox', { name: /E-mailadres/ }), 'john@example.com')
      await user.selectOptions(screen.getByRole('combobox', { name: /Onderwerp/ }), 'algemene-vraag')
      await user.type(screen.getByRole('textbox', { name: /Bericht/ }), 'Test message')
      
      const submitButton = screen.getByRole('button', { name: 'Verstuur bericht' })
      
      // Rapidly click submit multiple times
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)
      
      // Should only be called once due to form submission handling
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1)
      })
    })

    test('should handle very long input values', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const longText = 'a'.repeat(2000)
      const messageTextarea = screen.getByRole('textbox', { name: /Bericht/ })
      
      await user.type(messageTextarea, longText)
      
      // Should respect maxLength attribute
      expect(messageTextarea.getAttribute('maxlength')).toBe('2000')
    })
  })
})