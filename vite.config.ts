import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro({
      preset: process.env.NITRO_PRESET || 'node-server',
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  resolve: {
    alias: {
      // Fix for React 19 compatibility with use-sync-external-store
      // The shim is not needed in React 19 as useSyncExternalStore is built-in
      'use-sync-external-store/shim/with-selector.js': path.resolve(
        import.meta.dirname,
        'src/lib/use-sync-external-store-with-selector.ts'
      ),
      'use-sync-external-store/shim/with-selector': path.resolve(
        import.meta.dirname,
        'src/lib/use-sync-external-store-with-selector.ts'
      ),
      'use-sync-external-store/shim/index.js': path.resolve(
        import.meta.dirname,
        'src/lib/use-sync-external-store-shim.ts'
      ),
      'use-sync-external-store/shim': path.resolve(
        import.meta.dirname,
        'src/lib/use-sync-external-store-shim.ts'
      ),
    },
  },
})

export default config
