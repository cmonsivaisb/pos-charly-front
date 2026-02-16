/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        space: ['var(--font-space)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        'md': '6px',
        'lg': '6px',
        'xl': '6px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        darkretail: {
          "primary": "#F97316",
          "secondary": "#1E293B",
          "accent": "#FACC15",
          "neutral": "#1E293B",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "info": "#3ABFF8",
          "success": "#22C55E",
          "warning": "#FACC15",
          "error": "#EF4444",
          "--rounded-btn": "6px",
          "--rounded-badge": "6px",
          "--rounded-box": "6px",
          "base-content": "#F8FAFC",
        },
        lightretail: {
          "primary": "#EA580C",
          "secondary": "#FFFFFF",
          "accent": "#CA8A04",
          "neutral": "#F1F5F9",
          "base-100": "#F1F5F9",
          "base-200": "#FFFFFF",
          "base-300": "#E2E8F0",
          "info": "#3ABFF8",
          "success": "#16A34A",
          "warning": "#CA8A04",
          "error": "#EF4444",
          "--rounded-btn": "6px",
          "--rounded-badge": "6px",
          "--rounded-box": "6px",
          "base-content": "#0F172A",
        },
      },
    ],
    darkTheme: "darkretail",
  },
};
