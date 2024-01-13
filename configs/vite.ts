import dts from 'vite-plugin-dts';

/**
 * 服务器配置
 * @param { number } [port = 3000] 端口号
 * @returns { object } 配置
 */
const configServer = (port: number = 3000): object => ({
  port,
  host: '0.0.0.0'
});

/**
 * css 配置
 */
const configCss = {
  modules: {
    generateScopedName: '[local]'
  }
};

/**
 * TS 类型构建配置
 */
const configDts = dts({
  rollupTypes: true,
  insertTypesEntry: true,
  copyDtsFiles: true
});

/**
 * 构建配置
 * @param { string } name 变量名，一个有效的 JavaScript 标识符，因为它将被用作变量名，主要用于 UMD 构建
 * @param { string } filename 文件名
 * @param { [string] } formats 构建格式
 * @param { [string] } external 外部依赖
 * @param { [object] } globals 全局变量名称
 * @returns { object } 配置
 */
const configBuild = (name: string, filename: string, formats: string[], external: string[] = [], globals: object = {}): object => ({
  minify: 'esbuild',
  esbuild: {
    legalComments: 'none', // 移除版权注释
    minifyWhitespace: true, // 压缩空白字符
    minifyIdentifiers: true, // 压缩标识符
    minifySyntax: true // 使用语法转换来实现更小的输出文件
  },
  lib: {
    entry: 'src/index.ts',
    name,
    formats,
    fileName: (format: string) => {
      if (format === 'cjs') {
        return `${filename}.cjs`;
      } else if (format === 'esm') {
        return `${filename}.mjs`;
      }
      return `${filename}.js`;
    }
  },
  rollupOptions: {
    external,
    output: {
      globals,
      assetFileNames: (assetInfo) => {
        if (assetInfo.name === 'style.css') {
          return `${filename}.css`;
        }
        return assetInfo.name;
      }
    }
  }
});

/**
 * 解析配置
 */
const configResolve = {
  alias: {
    '@': '/src'
  }
};

export { configServer, configCss, configDts, configBuild, configResolve };
