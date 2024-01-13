import { defineConfig } from 'vite';
import { configServer, configDts, configBuild, configResolve } from './configs/vite';

export default defineConfig({
  base: './',
  server: configServer(),
  plugins: [configDts],
  build: configBuild('Files', 'files', ['cjs', 'esm', 'umd']),
  resolve: configResolve
});
