/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mend: {
          green: '#4A7C59',
          greenLight: '#EAF2ED',
          bg: '#FAFAF7',
          surface: '#FFFFFF',
          textPrimary: '#1A1A1A',
          textMuted: '#6B7280',
          warm: '#F59E0B',
          warmLight: '#FEF3C7',
          blue: '#3B82F6',
          blueLight: '#EFF6FF',
          red: '#EF4444',
          redLight: '#FEF2F2',
          border: '#E5E7EB',
          ydTeal: '#00897B',
          ydTealLight: '#E0F2F1',
        },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
    },
  },
  plugins: [],
}
