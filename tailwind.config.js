
/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  important: true,
  content: [
    "./src/**/*.{html,js}","./public/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [

  ],
}

