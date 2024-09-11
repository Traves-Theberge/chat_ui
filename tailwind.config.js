/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0D0D0D',
        'vibrant-red': '#F03535',
        'light-gray': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        'body': { fontFamily: theme('fontFamily.sans') },
      })
    }
  ],
}
