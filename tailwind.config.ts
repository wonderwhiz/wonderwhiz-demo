import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        wonderwhiz: {
          purple: '#7E30E1',
          pink: '#FF5EBA',
          gold: '#FFC72C',
          blue: '#4A6FFF',
          yellow: '#FFE883',
          dark: '#20053D',
          'deep-purple': '#2A1B5D',
          'light-purple': '#3D2A7D',
          'bright-pink': '#FF5BA3',
          'vibrant-yellow': '#FFD54F',
          cyan: '#00E2FF',
          'blue-accent': '#4A6FFF',
          green: '#00D68F',
          orange: '#FF8A3D',
          teal: '#00CED1',
          'light-blue': '#87CEFA'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        'baloo': ['"Baloo 2"', 'sans-serif'],
        'lexend': ['Lexend Deca', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
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
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'sparkle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5', transform: 'scale(0.9)' }
        },
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-5px) rotate(2deg)' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' }
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 5s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        'float-gentle': 'float-gentle 5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'pop': 'pop 0.5s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer-slow': 'shimmer 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'wonderwhiz-gradient': 'linear-gradient(to bottom, #20053D, #3D0E64)',
        'button-gradient': 'linear-gradient(90deg, #FF5BA3 0%, #FF5BA3 100%)',
        'cosmic-gradient': 'linear-gradient(to bottom, #2A1B5D, #3D2A7D)',
        'wonder-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'wonder-hover': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(126, 48, 225, 0.5)',
        'glow-blue': '0 0 15px rgba(0, 224, 255, 0.5)',
        'glow-pink': '0 0 15px rgba(255, 94, 186, 0.5)',
        'glow-gold': '0 0 15px rgba(255, 199, 44, 0.5)',
        'glow-brand-pink': '0 0 15px rgba(255, 91, 163, 0.5)',
        'glow-brand-yellow': '0 0 15px rgba(255, 213, 79, 0.5)',
        'glow-brand-cyan': '0 0 15px rgba(0, 226, 255, 0.5)',
      },
      cursor: {
        'wand': 'url(/wand-cursor.png), pointer',
        'sparkles': 'url(/sparkles-cursor.png), pointer',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
