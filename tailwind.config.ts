import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Libre Franklin", "system-ui", "sans-serif"],
        metrophobic: ["Metrophobic", "sans-serif"],
      },
      colors: {
        // Mobiz Brand — Primary Red
        primary: {
          DEFAULT: "#D8242A",
          100: "#F5E0E1",
          200: "#B01E23",
          300: "#F07378",
          400: "#D8242A",
          500: "#CF1920",
          600: "#B0161C",
          700: "#911217",
          800: "#720F13",
          900: "#540B0E",
          foreground: "#FFFFFF",
        },
        // Mobiz Brand — Secondary Purple
        secondary: {
          DEFAULT: "#613BFE",
          100: "#EEEBFB",
          200: "#E2DDF5",
          300: "#9C90CC",
          500: "#170E4A",
          600: "#3C2C7F",
          700: "#0F0A30",
          800: "#2A1E5C",
          900: "#181227",
          foreground: "#EEEBFB",
        },
        // Mobiz Brand — Dark
        dark: "#130E23",
        // Grayscale
        gray: {
          50: "#FAFAFA",
          100: "#F4F4F4",
          200: "#E0E0E0",
          400: "#A1A1A1",
          500: "#737373",
          600: "#525252",
          700: "#303030",
          800: "#363636",
          900: "#221F1F",
        },
        // Accent
        accent: {
          yellow: "#FFD000",
          orange: "#F9A931",
          pink: "#FF2D9F",
          blue: "#1854E8",
        },
        // Status Colors
        risk: {
          high: "#EF4444",
          medium: "#F9A931",
          low: "#22C55E",
        },
        // Shadcn compatibility tokens
        background: "#130E23",
        foreground: "#EEEBFB",
        card: {
          DEFAULT: "rgba(42,30,92,0.35)",
          foreground: "#EEEBFB",
        },
        popover: {
          DEFAULT: "#181227",
          foreground: "#EEEBFB",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#9C90CC",
        },
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.08)",
        ring: "#613BFE",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#EEEBFB",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
        "2xl": "28px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.2)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.3)",
        glow: "0 0 40px rgba(97,59,254,0.15)",
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
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(120%)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-out-right": "slide-out-right 0.3s ease-in forwards",
        "fade-in": "fade-in 0.3s ease-out",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
