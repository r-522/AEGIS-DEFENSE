import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0E12",
        "charcoal-plate": "#171B22",
        gunmetal: "#2B323D",
        "aegis-gold": "#C8A45D",
        "ward-cyan": "#5FD7D1",
        ember: "#D45A35",
        verdigris: "#6FA38B",
        bone: "#D8D0BE",
        ash: "#8B9098",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "ward-sweep": "wardSweep 3s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "flicker": "flicker 0.15s ease-in-out infinite alternate",
        "slide-in-left": "slideInLeft 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-up": "slideInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "lock-in": "lockIn 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "scan-line": "scanLine 4s linear infinite",
      },
      keyframes: {
        wardSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        flicker: {
          "0%": { opacity: "0.9" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-24px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        lockIn: {
          "0%": { transform: "scaleX(0.95) scaleY(0.95)", opacity: "0.5" },
          "100%": { transform: "scaleX(1) scaleY(1)", opacity: "1" },
        },
        scanLine: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
      },
      boxShadow: {
        "panel": "inset 0 1px 0 rgba(200, 164, 93, 0.08), 0 4px 24px rgba(0, 0, 0, 0.6)",
        "panel-active": "inset 0 1px 0 rgba(200, 164, 93, 0.2), 0 0 0 1px rgba(200, 164, 93, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8)",
        "button-idle": "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.4)",
        "button-hover": "inset 0 1px 0 rgba(200, 164, 93, 0.1), 0 0 0 1px rgba(200, 164, 93, 0.4), 0 4px 16px rgba(0,0,0,0.6)",
        "ember-glow": "0 0 12px rgba(212, 90, 53, 0.4)",
        "cyan-glow": "0 0 12px rgba(95, 215, 209, 0.3)",
        "gold-glow": "0 0 16px rgba(200, 164, 93, 0.25)",
      },
      backgroundImage: {
        "panel-gradient": "linear-gradient(180deg, rgba(43,50,61,0.4) 0%, rgba(23,27,34,0.8) 100%)",
        "scanlines": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
