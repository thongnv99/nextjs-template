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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
