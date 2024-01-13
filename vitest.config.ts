import configTest from './configs/vitest';
import { defineConfig } from 'vitest/config';
import { configResolve } from './configs/vite';

export default defineConfig({
  test: configTest,
  resolve: configResolve
});
