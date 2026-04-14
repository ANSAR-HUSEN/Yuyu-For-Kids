/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F5',
        blush: '#FFD1DC',
        softPink: '#FF9EAA',
        mint: '#B5EAD7',
        peach: '#FFDAC1',
        gold: '#FFB347',
        darkBrown: '#5C4033',
        warmBrown: '#8B5E3C',
        lightYellow: '#FFF8E7',
        softGrey: '#F5F5F5',
      },
    },
  },
  plugins: [],
}