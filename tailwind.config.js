/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          800: "#18141c",
          900: "#120f16",
        },
        yellow: {
          400: "#FEDE00",
        },
      },

      // Make layout instantly feel more “designed”
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        lift: "0 20px 60px rgba(0,0,0,0.12)",
        ring: "0 0 0 1px rgba(255,255,255,0.06)",
      },

      backgroundImage: {
        heropattern: "url(/herobgc.jpg)",
        // subtle premium gradients (works in both themes)
        glow:
          "radial-gradient(600px circle at 20% 10%, rgba(254, 222, 0, 0.12), transparent 40%), radial-gradient(700px circle at 80% 20%, rgba(59, 130, 246, 0.10), transparent 45%)",
      },
    },
  },
  plugins: [],
};
