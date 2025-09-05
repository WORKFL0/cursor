/**
 * Unit Tests for Utility Functions
 * Tests the core utility functions used throughout the application
 */

import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    test('should merge simple class names', () => {
      const result = cn('bg-red-500', 'text-white')
      expect(result).toContain('bg-red-500')
      expect(result).toContain('text-white')
    })

    test('should handle conditional classes', () => {
      const isActive = true
      const result = cn(
        'base-class',
        isActive && 'active-class',
        !isActive && 'inactive-class'
      )
      
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
      expect(result).not.toContain('inactive-class')
    })

    test('should merge conflicting Tailwind classes correctly', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      // twMerge should keep only the last conflicting class
      expect(result).toBe('bg-blue-500')
    })

    test('should handle array inputs', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    test('should handle object inputs', () => {
      const result = cn({
        'active': true,
        'inactive': false,
        'disabled': true
      })
      
      expect(result).toContain('active')
      expect(result).toContain('disabled')
      expect(result).not.toContain('inactive')
    })

    test('should handle null and undefined values', () => {
      const result = cn('class1', null, undefined, 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    test('should handle empty strings and whitespace', () => {
      const result = cn('  ', '', '  class1  ', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    test('should handle complex responsive and state classes', () => {
      const result = cn(
        'text-sm md:text-base lg:text-lg',
        'hover:bg-blue-500 focus:bg-blue-600',
        'dark:text-white dark:bg-gray-800'
      )
      
      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-base')
      expect(result).toContain('lg:text-lg')
      expect(result).toContain('hover:bg-blue-500')
      expect(result).toContain('focus:bg-blue-600')
      expect(result).toContain('dark:text-white')
      expect(result).toContain('dark:bg-gray-800')
    })

    test('should merge duplicate responsive classes correctly', () => {
      const result = cn(
        'text-sm md:text-base',
        'md:text-lg lg:text-xl'
      )
      
      // Should keep the last md: class and all others
      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-lg') // Last md: class wins
      expect(result).not.toContain('md:text-base')
      expect(result).toContain('lg:text-xl')
    })

    test('should handle variant-style conditional classes', () => {
      const variant = 'primary'
      const size = 'lg'
      const disabled = false
      
      const result = cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'lg' && 'h-11 px-8 text-base',
        disabled && 'pointer-events-none opacity-50'
      )
      
      expect(result).toContain('bg-blue-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-blue-700')
      expect(result).toContain('h-11')
      expect(result).toContain('px-8')
      expect(result).toContain('text-base')
      expect(result).not.toContain('pointer-events-none')
      expect(result).not.toContain('opacity-50')
    })

    test('should handle performance with many classes', () => {
      const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`)
      
      const start = Date.now()
      const result = cn(...manyClasses)
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(50) // Should be very fast
      expect(result).toContain('class-0')
      expect(result).toContain('class-99')
    })
  })
})

describe('Edge Cases and Error Handling', () => {
  test('should handle no arguments', () => {
    const result = cn()
    expect(result).toBe('')
  })

  test('should handle only falsy values', () => {
    const result = cn(false, null, undefined, '')
    expect(result).toBe('')
  })

  test('should handle mixed valid and invalid inputs', () => {
    const result = cn(
      'valid-class',
      false,
      null,
      undefined,
      '',
      'another-valid-class'
    )
    
    expect(result).toContain('valid-class')
    expect(result).toContain('another-valid-class')
  })

  test('should handle special characters in class names', () => {
    const result = cn('class-with-123', 'class_with_underscores', 'class:with:colons')
    expect(result).toContain('class-with-123')
    expect(result).toContain('class_with_underscores')
    expect(result).toContain('class:with:colons')
  })

  test('should handle very long class names', () => {
    const longClassName = 'very-long-class-name-that-might-cause-issues-' + 'a'.repeat(100)
    const result = cn(longClassName, 'normal-class')
    
    expect(result).toContain(longClassName)
    expect(result).toContain('normal-class')
  })
})

describe('Integration with Tailwind CSS', () => {
  test('should properly merge spacing conflicts', () => {
    const result = cn('p-4', 'p-6 m-2')
    expect(result).toBe('p-6 m-2')
  })

  test('should properly merge color conflicts', () => {
    const result = cn('text-red-500', 'text-blue-500 bg-white')
    expect(result).toBe('text-blue-500 bg-white')
  })

  test('should properly merge size conflicts', () => {
    const result = cn('w-4 h-4', 'w-6 h-8')
    expect(result).toBe('w-6 h-8')
  })

  test('should handle prefix conflicts correctly', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500 focus:bg-green-500')
    expect(result).toBe('hover:bg-blue-500 focus:bg-green-500')
  })

  test('should preserve important modifiers', () => {
    const result = cn('text-red-500 !text-blue-500')
    expect(result).toContain('!text-blue-500')
  })

  test('should handle arbitrary values', () => {
    const result = cn('w-[100px]', 'h-[50px] bg-[#ff0000]')
    expect(result).toContain('w-[100px]')
    expect(result).toContain('h-[50px]')
    expect(result).toContain('bg-[#ff0000]')
  })
})

describe('Performance and Memory Tests', () => {
  test('should handle repeated calls efficiently', () => {
    const baseClasses = 'inline-flex items-center justify-center'
    
    const start = Date.now()
    for (let i = 0; i < 1000; i++) {
      cn(baseClasses, `dynamic-class-${i % 10}`)
    }
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(100) // Should handle 1000 calls quickly
  })

  test('should not cause memory leaks with many different class combinations', () => {
    const initialMemory = process.memoryUsage().heapUsed
    
    // Generate many different class combinations
    for (let i = 0; i < 1000; i++) {
      cn(
        `class-${i}`,
        i % 2 === 0 && `even-${i}`,
        i % 3 === 0 && `triple-${i}`,
        `final-${i}`
      )
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    
    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory
    
    // Memory increase should be reasonable (less than 10MB for this test)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})

describe('Real-world Usage Scenarios', () => {
  test('should handle button component classes', () => {
    const variant = 'primary'
    const size = 'default'
    const disabled = false
    const loading = true
    
    const result = cn(
      // Base styles
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // Variants
      variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
      variant === 'link' && 'text-primary underline-offset-4 hover:underline',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
      // Sizes
      size === 'default' && 'h-10 px-4 py-2',
      size === 'sm' && 'h-9 rounded-md px-3',
      size === 'lg' && 'h-11 rounded-md px-8',
      size === 'icon' && 'h-10 w-10',
      // States
      disabled && 'pointer-events-none opacity-50',
      loading && 'cursor-not-allowed'
    )
    
    expect(result).toContain('bg-blue-600')
    expect(result).toContain('text-white')
    expect(result).toContain('hover:bg-blue-700')
    expect(result).toContain('h-10')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('cursor-not-allowed')
  })

  test('should handle card component classes', () => {
    const elevated = true
    const interactive = true
    const fullWidth = false
    
    const result = cn(
      // Base card styles
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      // Conditional styles
      elevated && 'shadow-md',
      interactive && 'hover:shadow-lg transition-shadow cursor-pointer',
      fullWidth ? 'w-full' : 'w-auto'
    )
    
    expect(result).toContain('rounded-lg')
    expect(result).toContain('border')
    expect(result).toContain('bg-card')
    expect(result).toContain('shadow-md')
    expect(result).toContain('hover:shadow-lg')
    expect(result).toContain('cursor-pointer')
    expect(result).toContain('w-auto')
  })
})