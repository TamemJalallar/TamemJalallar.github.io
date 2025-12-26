/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
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
      backgroundImage: {
        heropattern: "url(/herobgc.jpg)",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        lift: "0 18px 50px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
