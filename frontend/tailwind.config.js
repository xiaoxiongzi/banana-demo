module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8C00',
          50: '#FFE5CC',
          100: '#FFD9B8',
          200: '#FFC28F',
          300: '#FFAB66',
          400: '#FF943D',
          500: '#FF8C00',
          600: '#CC7000',
          700: '#995400',
          800: '#663800',
          900: '#331C00'
        },
        banana: {
          light: '#FFFACD',
          DEFAULT: '#FFF8DC',
          dark: '#FFE4B5'
        }
      },
      backgroundImage: {
        'gradient-banana': 'linear-gradient(to bottom, #FFF8DC, #FFFACD)'
      }
    }
  },
  plugins: []
}

