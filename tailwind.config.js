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
    },
  },
  plugins: [],
}
