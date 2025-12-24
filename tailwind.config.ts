import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			// Primary is now theme-aware and provides proper contrast
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			// Workflo brand colors - Premium Design System
  			// Apple/DEPT/MediaMonks Quality Level
  			workflo: {
  				// Primary Yellow - Main accent color (NEVER changes in dark mode)
  				yellow: '#FFD938',
  				'yellow-light': '#FFF4BF',
  				'yellow-dark': '#E6C230',

  				// Primary Black & White - Foundation colors
  				black: '#111111',
  				white: '#FFFFFF',

  				// Complete Gray Scale - Light & Dark Mode Support
  				'gray-50': '#F8F8F8',   // Subtle backgrounds (light mode)
  				'gray-100': '#EDEDED',  // Card backgrounds, borders (light mode)
  				'gray-300': '#C1C1C1',  // Secondary text, icons
  				'gray-600': '#6A6A6A',  // Muted text
  				'gray-800': '#2A2A2A',  // Borders (dark mode)
  				'gray-900': '#1A1A1A',  // Card backgrounds (dark mode)
  				'gray-950': '#0A0A0A',  // Background (dark mode)

  				// Status Colors
  				success: '#28C76F',
  				warning: '#FFA100',
  				error: '#FF4D4D',

  				// Legacy colors (deprecated - kept for backwards compatibility)
  				primary: 'hsl(var(--workflo-primary))',
  				navy: '#0F172A',
  				slate: '#1E293B',
  				gray: '#64748B',
  			},
  			// Additional semantic colors for better UX
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			// Legacy yellow scale - deprecated, use workflo.primary instead
  			yellow: {
  				'50': '#fffef0',
  				'100': '#fffdd1',
  				'200': '#fff9a3',
  				'300': '#ffd500', // Pure yellow instead of orangish
  				'400': 'hsl(var(--workflo-primary))', // Migrate to primary
  				'500': 'hsl(var(--workflo-primary-dark))', // Migrate to primary-dark
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		// Art Director Border Radius System (8px standard)
  		borderRadius: {
  			none: '0',
  			sm: '0.25rem',      // 4px
  			DEFAULT: '0.5rem',  // 8px - Standard buttons, inputs
  			md: '0.75rem',      // 12px - Cards
  			lg: 'var(--radius)', // CSS variable for flexibility
  			xl: '1.5rem',       // 24px - Large cards
  			full: '9999px'      // Pills, avatars
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'var(--font-sans)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' },
  			},
  			'slide-in': {
  				'0%': { transform: 'translateY(10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' },
  			},
  			'blob': {
  				'0%': {
  					transform: 'translate(0px, 0px) scale(1)',
  				},
  				'33%': {
  					transform: 'translate(30px, -50px) scale(1.1)',
  				},
  				'66%': {
  					transform: 'translate(-20px, 20px) scale(0.9)',
  				},
  				'100%': {
  					transform: 'translate(0px, 0px) scale(1)',
  				},
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0)',
  				},
  				'50%': {
  					transform: 'translateY(-20px)',
  				},
  			},
  			'scroll': {
  				'0%': {
  					transform: 'translateX(0)',
  				},
  				'100%': {
  					transform: 'translateX(-50%)',
  				},
  			},
  			'shimmer': {
  				'0%': {
  					backgroundPosition: '-200% 0',
  				},
  				'100%': {
  					backgroundPosition: '200% 0',
  				},
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-in-out',
  			'slide-in': 'slide-in 0.3s ease-out',
  			'bounce-slow': 'bounce 3s infinite',
  			'blob': 'blob 7s infinite',
  			'float': 'float 6s ease-in-out infinite',
  			'scroll': 'scroll 20s linear infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  		},
  		// Premium Design System - 8px Base Grid
  		spacing: {
  			'safe-top': 'env(safe-area-inset-top)',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-left': 'env(safe-area-inset-left)',
  			'safe-right': 'env(safe-area-inset-right)',
  			// Art Director Spacing Scale (8px base)
  			'xs': '0.5rem',    // 8px
  			'sm': '1rem',      // 16px
  			'md': '1.5rem',    // 24px
  			'lg': '2rem',      // 32px
  			'xl': '3rem',      // 48px
  			'2xl': '4rem',     // 64px
  			'3xl': '6rem',     // 96px
  			'4xl': '7.5rem',   // 120px - Section spacing
  		},
  		// Touch-friendly minimum sizes
  		minWidth: {
  			'touch': '44px',
  		},
  		minHeight: {
  			'touch': '44px',
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};

export default config;