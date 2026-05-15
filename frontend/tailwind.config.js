/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.28) 0%, transparent 55%), radial-gradient(900px 500px at 90% 15%, rgba(16,185,129,0.22) 0%, transparent 60%), radial-gradient(900px 500px at 60% 90%, rgba(236,72,153,0.18) 0%, transparent 60%)',
        'mesh-dark':
          'radial-gradient(1100px 600px at 10% 10%, rgba(99,102,241,0.35) 0%, transparent 55%), radial-gradient(900px 500px at 90% 15%, rgba(16,185,129,0.22) 0%, transparent 60%), radial-gradient(900px 500px at 60% 90%, rgba(236,72,153,0.20) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}

