export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#650606', deep: '#430707', brown: '#3B160B' },
        gold: { DEFAULT: '#E9AE43', light: '#FFD27C', dark: '#B8791F' },
        cream: { DEFAULT: '#FFF0D4', sand: '#EAC69A' },
        ink: '#301509',
      },
      fontFamily: {
        display: ['Lalezar', 'Cairo', 'sans-serif'],
        body: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
