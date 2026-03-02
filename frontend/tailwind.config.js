/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tmcc: {
          DEFAULT: '#00a652',
          dark: '#008c46',
        },
        /* Staff dashboard accent borders (image style) */
        staff: {
          green: '#1ac76a',
          cyan: '#00bcd4',
          yellow: '#ffc107',
          red: '#dc3545',
          'sy-yellow': '#ffcd39',
          'sy-green': '#28a745',
        },
      },
    },
  },
  plugins: [],
};
