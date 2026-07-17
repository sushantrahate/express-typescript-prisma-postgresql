import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/types/**', 'src/server.ts'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 55,
        statements: 60,
      },
    },
  },
});
