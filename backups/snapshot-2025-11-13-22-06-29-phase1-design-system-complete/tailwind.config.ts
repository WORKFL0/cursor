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
  			// Workflo brand colors - Art Director Design System
  			workflo: {
  				// Primary Yellow - Main accent color
  				yellow: '#FFD938',
  				'yellow-light': '#FFF4BF',
  				'yellow-dark': '#E6C230',

  				// Primary Black - Text and hero backgrounds
  				black: '#111111',
  				white: '#FFFFFF',

  				// Gray Scale - Supporting colors
  				'gray-50': '#F8F8F8',
  				'gray-100': '#EDEDED',
  				'gray-300': '#C1C1C1',
  				'gray-600': '#6A6A6A',
  				'gray-900': '#1A1A1A',

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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  		// Mobile optimizations
  		spacing: {
  			'safe-top': 'env(safe-area-inset-top)',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-left': 'env(safe-area-inset-left)',
  			'safe-right': 'env(safe-area-inset-right)',
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