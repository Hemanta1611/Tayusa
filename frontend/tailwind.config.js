/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#065fd4',
        'secondary': '#606060',
        'background': '#f9f9f9',
        'hover': '#f2f2f2',
        'divider': '#e0e0e0',
      },
    },
  },
  plugins: [],
}
