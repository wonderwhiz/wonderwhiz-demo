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
        // Core Design System
        surface: {
          primary: "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          tertiary: "hsl(var(--surface-tertiary))",
          elevated: "hsl(var(--surface-elevated))",
          glass: "hsl(var(--surface-glass))",
          overlay: "hsl(var(--surface-overlay))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
          inverse: "hsl(var(--text-inverse))",
          accent: "hsl(var(--text-accent))",
        },
        interactive: {
          hover: "hsl(var(--interactive-hover))",
          active: "hsl(var(--interactive-active))",
          focus: "hsl(var(--interactive-focus))",
          disabled: "hsl(var(--interactive-disabled))",
        },
        accent: {
          brand: "hsl(var(--accent-brand))",
          success: "hsl(var(--accent-success))",
          warning: "hsl(var(--accent-warning))",
          error: "hsl(var(--accent-error))",
          info: "hsl(var(--accent-info))",
        },
        
        // Legacy Compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // WonderWhiz Brand Colors (HSL)
        wonderwhiz: {
          blue: 'hsl(225 100% 64%)',      // #4A6FFF
          cyan: 'hsl(188 100% 38%)',      // #00A8C0
          purple: 'hsl(264 77% 53%)',     // #7E30E1
          'light-purple': 'hsl(257 56% 33%)', // #3D2A7D
          'deep-purple': 'hsl(252 56% 24%)',  // #2A1B5D
          'bright-pink': 'hsl(327 100% 38%)', // #C0006A
          'vibrant-yellow': 'hsl(38 100% 47%)', // #F0A500
          orange: 'hsl(16 78% 54%)',      // #E66A2E
          green: 'hsl(159 100% 33%)',     // #00A36C
          teal: 'hsl(181 100% 41%)',      // #00CED1
          'light-blue': 'hsl(226 83% 58%)', // #4169E1
          gold: 'hsl(44 100% 58%)',       // #FFC72C
          dark: 'hsl(270 76% 13%)',       // #20053D
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
        'lexend': ['Lexend Deca', 'sans-serif'],
      },
      backgroundImage: {
        'button-gradient': 'linear-gradient(90deg, #C0006A 0%, #C0006A 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
