import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'text-summary'],
      exclude: [
        'node_modules/',
        'mock-server/',
        'lambda-deployment/',
        '**/*.config.js',
        'app.local.js',
        'index.js',
        '**/*.test.js',
      ],
      include: ['*.js'],
    },
  },
});
