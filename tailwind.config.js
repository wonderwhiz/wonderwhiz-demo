
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        wonderwhiz: {
          blue: 'hsl(var(--wonderwhiz-blue))',
          'blue-accent': 'hsl(var(--wonderwhiz-blue-accent))',
          cyan: 'hsl(var(--wonderwhiz-cyan))',
          purple: 'hsl(var(--wonderwhiz-purple))',
          'light-purple': 'hsl(var(--wonderwhiz-light-purple))',
          'deep-purple': 'hsl(var(--wonderwhiz-deep-purple))',
          'bright-pink': 'hsl(var(--wonderwhiz-bright-pink))',
          'vibrant-yellow': 'hsl(var(--wonderwhiz-vibrant-yellow))',
          orange: 'hsl(var(--wonderwhiz-orange))',
          green: 'hsl(var(--wonderwhiz-green))',
          teal: 'hsl(var(--wonderwhiz-teal))',
          'light-blue': 'hsl(var(--wonderwhiz-light-blue))',
          gold: 'hsl(var(--wonderwhiz-gold))',
          dark: '#20053D',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blob-slide": {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        "bounce-gentle": {
          "0%, 20%, 50%, 80%, 100%": { transform: 'translateY(0)' },
          "40%": { transform: 'translateY(-8px)' },
          "60%": { transform: 'translateY(-4px)' }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.8 }
        },
        "pulse-soft": {
          "0%, 100%": { 
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.1)"
          },
          "50%": { 
            transform: "scale(1.01)",
            boxShadow: "0 0 10px 3px rgba(255, 255, 255, 0.2)"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-in-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-in-out",
        "scale-up": "scale-up 0.2s ease-out forwards",
        "fade-in": "fade-in 0.2s ease-in forwards",
        "blob-slide": "blob-slide 8s infinite",
        "bounce-gentle": "bounce-gentle 2s infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite"
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'baloo': ['"Baloo 2"', 'sans-serif'],
        'lexend': ['Lexend Deca', 'sans-serif'], // Adding the missing lexend font definition
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
