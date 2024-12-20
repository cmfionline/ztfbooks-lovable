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
        // Core colors
        primary: "#141413", // Primary text and important elements
        secondary: "#828179", // Secondary text and less important elements
        accent: "#C7FB76", // Bright accent for CTAs and highlights
        
        // Background colors
        background: "#FAFAF8", // Main background
        surface: "#fff", // Surface/card background
        
        // Text colors
        "text-primary": "#141413",
        "text-secondary": "#828179",
        "text-muted": "#A3A299",
        
        // UI Element colors
        border: "#E6E4DD",
        input: "#F0EFEA",
        muted: "#C4C3BB",
        "muted-foreground": "#A3A299",
        
        // Semantic colors
        success: "#7EBF8E",
        info: "#61AAF2",
        warning: "#D4A27F",
        danger: "#D2886F",
        
        // Glass effects
        glass: {
          light: "#ffffff33",
          medium: "#ffffff66",
          dark: "#000000d9",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "SF Pro Display", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        container: "2rem",
        "container-lg": "4rem",
        "container-xl": "6rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;