export default {
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'
  })
};
