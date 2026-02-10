import path from 'path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.NODE_ENV)
  return {
    test: {
      // run tests in single thread to avoid concurrency issues in integration tests
      threads: false,
      globals: true,
      env: env,
      testTimeout: 30000,
      hookTimeout: 30000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
