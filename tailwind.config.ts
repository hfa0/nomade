import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/mdx/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@itsyouagency/ui/dist/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '5xl': '2.8rem',
      },
      maxWidth: {
        '8xl': '96rem',
      },
      colors: {
        primary: '#5b010d',
        secondary: '#800020',
        white: '#fff',
        dark: '#0d0d0d',
        light: '#f5ebdd',
        salt: '#f8fafc',
        gray: {
          50: '#FAFAFA',
          200: '#E9EAEB',
          500: '#717680',
          600: '#535862',
          800: '#252B37',
          300: '#D5D7DA',
          400: '#A4A7AE',
          700: '#414651',
          900: '#181D27',
        },
        warning: {
          400: '#FDB022',
        },
        success: {
          100: '#DCFAE6',
          500: '#17B26A',
        },
      },
      fontFamily: {
        poppins: 'Poppins',
        tommy: 'Tommy',
        tommyOutline: 'Tommy Outline',
        cooper: ['Cooper', 'serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      lineHeight: {
        '11': '3.4rem',
      },
      animation: {
        loop: 'loop 70s linear infinite',
      },
      keyframes: {
        loop: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  safelist: [{ pattern: /grid-cols-[0-9]/ }],
  plugins: [],
} satisfies Config;
