/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#c4e7ff",
        "on-error": "#690005",
        "tertiary-fixed-dim": "#7bd0ff",
        "error-container": "#93000a",
        "secondary": "#ffb95f",
        "primary-container": "#0f172a",
        "error": "#ffb4ab",
        "on-secondary-container": "#5b3800",
        "on-secondary-fixed": "#2a1700",
        "outline": "#909097",
        "on-tertiary-fixed-variant": "#004c69",
        "on-surface-variant": "#c6c6cd",
        "background": "#101415",
        "on-primary-fixed-variant": "#3f465c",
        "surface-dim": "#101415",
        "outline-variant": "#45464d",
        "on-tertiary-container": "#008abb",
        "surface-container-highest": "#323537",
        "primary-fixed": "#dae2fd",
        "surface-variant": "#323537",
        "surface-bright": "#363a3b",
        "on-tertiary-fixed": "#001e2c",
        "surface-tint": "#bec6e0",
        "primary-fixed-dim": "#bec6e0",
        "surface-container-low": "#191c1e",
        "secondary-container": "#ee9800",
        "surface-container-high": "#272a2c",
        "on-secondary": "#472a00",
        "on-primary-fixed": "#131b2e",
        "surface-container": "#1d2022",
        "secondary-fixed": "#ffddb8",
        "on-background": "#e0e3e5",
        "surface": "#101415",
        "tertiary-container": "#001a27",
        "tertiary": "#7bd0ff",
        "surface-container-lowest": "#0b0f10",
        "on-tertiary": "#00354a",
        "inverse-on-surface": "#2d3133",
        "secondary-fixed-dim": "#ffb95f",
        "on-primary": "#283044",
        "inverse-primary": "#565e74",
        "on-primary-container": "#798098",
        "primary": "#bec6e0",
        "on-secondary-fixed-variant": "#653e00",
        "inverse-surface": "#e0e3e5",
        "on-surface": "#e0e3e5",
        "on-error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "gutter": "16px",
        "base": "4px",
        "sm": "8px",
        "lg": "24px",
        "md": "16px",
        "margin": "20px",
        "xl": "32px"
      },
      fontFamily: {
        "headline-xl": ["Plus Jakarta Sans"],
        "body-md": ["Inter"],
        "label-bold": ["Inter"],
        "body-sm": ["Inter"],
        "headline-lg": ["Plus Jakarta Sans"]
      },
      fontSize: {
        "headline-xl": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400"}],
        "label-bold": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
        "body-sm": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}],
        "headline-lg": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
