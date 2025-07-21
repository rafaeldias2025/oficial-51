
import type { Config } from "tailwindcss";

const config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        success: {
          DEFAULT: 'var(--netflix-success)',
          foreground: 'var(--netflix-white)'
        },
        warning: {
          DEFAULT: 'var(--netflix-warning)',
          foreground: 'var(--netflix-white)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        
        // Netflix colors
        netflix: {
          black: 'var(--netflix-black)',
          darkGray: 'var(--netflix-dark-gray)',
          mediumGray: 'var(--netflix-medium-gray)',
          lightGray: 'var(--netflix-light-gray)',
          red: 'var(--netflix-red)',
          redHover: 'var(--netflix-red-hover)',
          white: 'var(--netflix-white)',
          border: 'var(--netflix-border)',
          success: 'var(--netflix-success)',
          warning: 'var(--netflix-warning)',
          error: 'var(--netflix-error)',
          info: 'var(--netflix-info)'
        },
        
        // Health colors
        health: {
          background: '#f8fafc',
          primary: '#3B82F6',
          secondary: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          success: '#10B981',
          heart: '#EF4444',
          steps: '#3B82F6',
          weight: '#10B981',
          calories: '#F59E0B'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        'netflix-sm': 'var(--netflix-shadow-sm)',
        'netflix-md': 'var(--netflix-shadow-md)',
        'netflix-lg': 'var(--netflix-shadow-lg)',
      },
      transitionProperty: {
        'netflix': 'var(--netflix-transition-default)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
      },
      backgroundImage: {
        'netflix-gradient-dark': 'var(--netflix-gradient-dark)',
        'netflix-gradient-overlay': 'var(--netflix-gradient-overlay)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;