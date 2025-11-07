import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname) }],
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['test/*.route.test.js'],
  },
})
