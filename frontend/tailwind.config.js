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
          50: '#FFFBF0',
          100: '#FFF4D6',
          200: '#FFE7A8',
          300: '#FFD56B',
          400: '#FFC241',
          500: '#F8A51B',
          600: '#E18A0F',
          700: '#B96A0A',
          800: '#8E4F07',
          900: '#623605'
        }
      },
      backgroundImage: {
        'gradient-banana': 'linear-gradient(to bottom, #FFF8DC, #FFFACD)'
      }
    }
  },
  plugins: []
}

