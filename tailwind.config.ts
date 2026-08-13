import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem", "2xl": "3rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Core brand tokens — black / white / dark gray, one restrained luxury accent
        ink: "#0E0F0D",       // near-black, primary text & surfaces
        paper: "#F7F6F2",     // light tone — used as text/foreground on dark ink/brass surfaces
        charcoal: "#2B2B27",  // dark gray, secondary surfaces
        stone: "#8C8879",     // muted warm gray, secondary text
        line: "#E4E1D7",      // hairline borders (on light/cream surfaces)
        brass: "#A9863D",     // single luxury accent — used sparingly only
        "brass-light": "#D9C596",
        success: "#3F7A5C",
        danger: "#B3462C",
        // Warm dark-navy site background + a warm cream card surface —
        // replaces the previous all-white/off-white look. `navy`/`navy-light`
        // are for full-bleed page & section backgrounds; `cream` is for
        // cards and panels that used to be plain white, sitting on top of navy.
        navy: "#141A2C",
        "navy-light": "#1C2440",
        "navy-line": "#2A3357",
        cream: "#F3ECDE",
        // shadcn-compatible aliases
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        "display-1": ["clamp(2.75rem, 5vw + 1rem, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2rem, 3vw + 1rem, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,15,13,0.04), 0 8px 24px -12px rgba(14,15,13,0.12)",
        lift: "0 20px 40px -16px rgba(14,15,13,0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
