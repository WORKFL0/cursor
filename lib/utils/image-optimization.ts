import { StaticImageData } from 'next/image'

export interface OptimizedImageConfig {
  src: string | StaticImageData
  alt: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  quality?: number
}

export interface ResponsiveImageSizes {
  mobile: string
  tablet: string
  desktop: string
}

/**
 * Generate responsive image sizes string for different breakpoints
 */
export function generateResponsiveSizes(
  sizes: Partial<ResponsiveImageSizes> = {}
): string {
  const defaults = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  }
  
  const finalSizes = { ...defaults, ...sizes }
  
  return `(max-width: 768px) ${finalSizes.mobile}, (max-width: 1200px) ${finalSizes.tablet}, ${finalSizes.desktop}`
}

/**
 * Generate optimized image configuration for different use cases
 */
export class ImageOptimizer {
  private static readonly BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhEDyDHf2H2pZWWggJOAPGFVJeQxCayVxjCMLqwHfqxdSVDM6RGJgGxgN+ajN5mpZhG/0oCiLOEiMKKhZFECNaYfKVcPGSHDiVjYhYfsBG'

  /**
   * Hero section images - high priority, above fold
   */
  static hero(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      priority: true,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      sizes: '100vw',
      quality: 90
    }
  }

  /**
   * Logo images - small, high priority
   */
  static logo(src: string | StaticImageData, alt: string, width?: number, height?: number): OptimizedImageConfig {
    return {
      src,
      alt,
      width: width || 120,
      height: height || 40,
      priority: true,
      quality: 100,
      sizes: '120px'
    }
  }

  /**
   * Client logo grid - lazy loaded, consistent sizing
   */
  static clientLogo(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      width: 120,
      height: 60,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 85,
      sizes: '120px'
    }
  }

  /**
   * Team photos - medium priority, consistent aspect ratio
   */
  static teamPhoto(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      width: 300,
      height: 300,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 85,
      sizes: generateResponsiveSizes({
        mobile: '150px',
        tablet: '200px', 
        desktop: '300px'
      })
    }
  }

  /**
   * Blog/news article images
   */
  static articleImage(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      width: 800,
      height: 450,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 80,
      sizes: generateResponsiveSizes({
        mobile: '100vw',
        tablet: '80vw',
        desktop: '800px'
      })
    }
  }

  /**
   * Service page icons/illustrations
   */
  static serviceIcon(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      width: 64,
      height: 64,
      quality: 90,
      sizes: '64px'
    }
  }

  /**
   * Background images for sections
   */
  static backgroundImage(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      fill: true,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 75,
      sizes: '100vw',
      style: { objectFit: 'cover' }
    } as OptimizedImageConfig
  }

  /**
   * Thumbnail images for cards/previews
   */
  static thumbnail(src: string | StaticImageData, alt: string): OptimizedImageConfig {
    return {
      src,
      alt,
      width: 200,
      height: 150,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 80,
      sizes: generateResponsiveSizes({
        mobile: '200px',
        tablet: '250px',
        desktop: '300px'
      })
    }
  }

  /**
   * Generate blur placeholder for an image
   */
  static generateBlurDataURL(color: string = '#f3f4f6'): string {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
      </svg>
    `)}`
  }

  /**
   * Custom configuration for specific needs
   */
  static custom(
    src: string | StaticImageData,
    alt: string,
    options: Partial<OptimizedImageConfig> = {}
  ): OptimizedImageConfig {
    return {
      src,
      alt,
      placeholder: 'blur',
      blurDataURL: this.BLUR_DATA_URL,
      quality: 80,
      ...options
    }
  }
}

/**
 * Image format detection and optimization recommendations
 */
export class ImageAnalyzer {
  static getOptimalFormat(filename: string): 'webp' | 'jpg' | 'png' | 'svg' {
    const ext = filename.toLowerCase().split('.').pop()
    
    switch (ext) {
      case 'svg':
        return 'svg'
      case 'png':
        // PNGs are good for logos and graphics with transparency
        return 'png'
      case 'jpg':
      case 'jpeg':
        // JPEGs are good for photos
        return 'webp' // Recommend WebP for better compression
      default:
        return 'webp'
    }
  }

  static shouldUsePriority(imagePath: string): boolean {
    const priorityImages = [
      'hero',
      'logo',
      'banner',
      'above-fold'
    ]
    
    return priorityImages.some(keyword => 
      imagePath.toLowerCase().includes(keyword)
    )
  }

  static getRecommendedQuality(imageType: 'photo' | 'graphic' | 'icon' | 'background'): number {
    const qualityMap = {
      photo: 80,
      graphic: 90,
      icon: 95,
      background: 75
    }
    
    return qualityMap[imageType] || 80
  }
}

/**
 * Lazy loading intersection observer for custom components
 */
export class LazyImageLoader {
  private static observer: IntersectionObserver | null = null

  static init() {
    if (typeof window === 'undefined' || this.observer) return

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const dataSrc = img.getAttribute('data-src')
          
          if (dataSrc) {
            img.src = dataSrc
            img.removeAttribute('data-src')
            img.classList.remove('lazy-loading')
            img.classList.add('lazy-loaded')
          }
          
          this.observer?.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })
  }

  static observe(element: HTMLImageElement) {
    if (this.observer) {
      this.observer.observe(element)
    }
  }

  static disconnect() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

/**
 * Performance monitoring for images
 */
export class ImagePerformanceMonitor {
  static trackImageLoad(imageSrc: string, startTime: number) {
    if (typeof window === 'undefined') return

    const loadTime = performance.now() - startTime
    
    // Send to analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('event', 'image_load_time', {
        image_src: imageSrc,
        load_time: Math.round(loadTime),
        event_category: 'Performance'
      })
    }

    console.log(`Image loaded: ${imageSrc} in ${Math.round(loadTime)}ms`)
  }

  static trackLargestContentfulPaint() {
    if (typeof window === 'undefined') return

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      if (!lastEntry) return
      
      console.log('LCP:', Math.round(lastEntry.startTime), 'ms')
      
      if ((window as any).gtag) {
        (window as any).gtag('event', 'largest_contentful_paint', {
          value: Math.round(lastEntry.startTime),
          event_category: 'Performance'
        })
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  }
}

export default ImageOptimizer