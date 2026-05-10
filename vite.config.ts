import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [
    devtools(),
    nitro({
      preset: process.env.NITRO_PRESET || 'node-server',
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
