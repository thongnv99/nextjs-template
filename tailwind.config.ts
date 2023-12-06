import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/elements/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '0.5': '0.2rem',
        '1': '0.4rem',
        '1.5': '0.6rem',
        '2': '0.8rem',
        '2.5': '10rem',
        '3': '1.2rem',
        '3.5': '1.4rem',
        '4': '1.6rem',
        '5': '2rem',
        '6': '2.4rem',
        '7': '2.8rem',
        '8': '3.2rem',
        '9': '2.6rem',
        '10': '4rem',
        '11': '4.4rem',
        '12': '4.8rem',
        '14': '5.6rem',
      },
      borderRadius: {
        sm: '0.2rem',
        md: '0.4rem',
        lg: '0.8rem',
      },
      fontSize: {
        sm: [
          '1.4rem',
          {
            lineHeight: '2rem',
          },
        ],
        base: [
          '1.6rem',
          {
            lineHeight: '2.4rem',
          },
        ],
        lg: [
          '1.8rem',
          {
            lineHeight: '2.8rem',
          },
        ],
      },
    },

    colors: {
      primary: {
        DEFAULT: 'var(--primary-500)',
        '50': 'var(--primary-50)',
        '100': 'var(--primary-100)',
        '200': 'var(--primary-200)',
        '300': 'var(--primary-300)',
        '400': 'var(--primary-400)',
        '500': 'var(--primary-500)',
        '600': 'var(--primary-600)',
        '700': 'var(--primary-700)',
        '800': 'var(--primary-800)',
        '900': 'var(--primary-900)',
        '950': 'var(--primary-950)',
      },
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
  },
  plugins: [],
};
export default config;
