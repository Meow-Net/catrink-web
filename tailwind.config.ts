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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        neon: {
          blue: "hsl(var(--neon-blue))",
          purple: "hsl(var(--neon-purple))",
          red: "hsl(var(--neon-red))",
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
        },
        glass: {
          DEFAULT: "hsl(var(--glass))",
          border: "hsl(var(--glass-border))",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
        techno: ["Audiowide", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
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
        "neon-pulse": {
          "0%, 100%": {
            textShadow:
              "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
            filter: "brightness(1)",
          },
          "50%": {
            textShadow:
              "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
            filter: "brightness(1.2)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
          },
          "50%": {
            boxShadow:
              "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "cat-blink": {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        "liquid-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "cat-blink": "cat-blink 3s ease-in-out infinite",
        "liquid-flow": "liquid-flow 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.2)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".neon-glow-blue": {
          "box-shadow":
            "0 0 10px theme(colors.neon.blue), 0 0 20px theme(colors.neon.blue), 0 0 40px theme(colors.neon.blue)",
        },
        ".neon-glow-purple": {
          "box-shadow":
            "0 0 10px theme(colors.neon.purple), 0 0 20px theme(colors.neon.purple), 0 0 40px theme(colors.neon.purple)",
        },
        ".neon-glow-red": {
          "box-shadow":
            "0 0 10px theme(colors.neon.red), 0 0 20px theme(colors.neon.red), 0 0 40px theme(colors.neon.red)",
        },
        ".text-glow-blue": {
          "text-shadow":
            "0 0 10px theme(colors.neon.blue), 0 0 20px theme(colors.neon.blue), 0 0 40px theme(colors.neon.blue)",
        },
        ".text-glow-purple": {
          "text-shadow":
            "0 0 10px theme(colors.neon.purple), 0 0 20px theme(colors.neon.purple), 0 0 40px theme(colors.neon.purple)",
        },
        ".text-glow-red": {
          "text-shadow":
            "0 0 10px theme(colors.neon.red), 0 0 20px theme(colors.neon.red), 0 0 40px theme(colors.neon.red)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
