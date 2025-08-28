import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { bg:'#1E1E1E', card:'#2B2B2B', text:'#FAFAFA', neon:'#00E0FF', purple:'#9B30FF', retro:'#FF3B3B', gold:'#FFD700' },
      boxShadow: { neon:'0 0 12px rgba(0,224,255,.6)', purple:'0 0 12px rgba(155,48,255,.6)' },
      fontFamily: { inter:['var(--font-inter)'], bebas:['var(--font-bebas)'], oswald:['var(--font-oswald)'] }
    },
  },
  plugins: [],
}
export default config
