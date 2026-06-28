/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Noto Sans KR"', '"Apple SD Gothic Neo"', 'Malgun Gothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
