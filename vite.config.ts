import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx,vue,js,jsx}'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.test.js',
        'src/**/*.test.jsx',
        'src/main.ts',
        'src/assets/**',
        'src/mock/**',
        'src/types/**',
        'src/**/*.d.ts',
      ],
    },
  },
})
