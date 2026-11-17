import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd, env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isProduction = env.NODE_ENV === 'production'

export default defineConfig({
  base: isProduction ? '/151/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'github-pages-spa-fallback',
      apply: 'build',
      closeBundle() {
        const outputDirectory = resolve(cwd(), 'dist')
        copyFileSync(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, '404.html'))
      },
    },
  ],
})