/**
 * 测试配置
 */
const configTest = {
  globals: true,
  include: ['src/**/*.test.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  coverage: {
    include: ['src/**/*.ts']
  }
};

export default configTest;
