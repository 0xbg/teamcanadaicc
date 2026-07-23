/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        red: '#cc1f2d',
        'red-dark': '#a01824',
        cream: '#f4eedd',
        ink: '#14100a',
        olive: '#463f31',
        gold: '#c2a15c',
        'gold-light': '#d9be86',
        body: '#241f16',
        'body-alt': '#3a382f',
        muted: '#7a7461',
        'muted-dark': '#5a5445',
        'muted-gold': '#a17c33',
        'text-light': '#e2ddcf',
        'text-light-alt': '#d9d4c6',
        'text-muted': '#9c9787',
        'text-muted-alt': '#c8c3b4',
        'border-light': '#d0c9b6',
        'border-dark': '#3a3325',
        'border-dark-alt': '#5a5241',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    }
  }
};