<div align="center">

# @kwooshung/files

![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/kwooshung/Files?labelColor=272e3b&color=00b42A&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/kwooshung/Files?labelColor=272e3b&color=165dff)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kwooshung/Files?labelColor=272e3b&color=165dff)
![GitHub top language](https://img.shields.io/github/languages/top/kwooshung/Files?labelColor=272e3b&color=165dff)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kwooshung/Files?labelColor=272e3b&color=165dff)
![GitHub issues](https://img.shields.io/github/issues/kwooshung/files?labelColor=272e3b&color=165dff)
[![NPM Version](https://img.shields.io/npm/v/@kwooshung/files?labelColor=272e3b&color=165dff)](https://www.npmjs.com/package/@kwooshung/files)
[![Npm.js Downloads/Week](https://img.shields.io/npm/dw/@kwooshung/files?labelColor=272e3b&labelColor=272e3b&color=165dff&logo=npm)](https://www.npmjs.com/package/@kwooshung/files)
[![Github CI/CD](https://github.com/kwooshung/Files/actions/workflows/ci.yml/badge.svg)](https://github.com/kwooshung/Files/actions/)
[![codecov](https://codecov.io/gh/kwooshung/Files/graph/badge.svg?token=VVZJE7H0KD)](https://codecov.io/gh/kwooshung/Files)
[![Maintainability](https://api.codeclimate.com/v1/badges/325d0881b1ca19165d35/maintainability)](https://codeclimate.com/github/kwooshung/Files/maintainability/)
[![GitHub License](https://img.shields.io/github/license/kwooshung/Files?labelColor=272e3b&color=165dff)](LICENSE)
[![Gitee Repo](https://img.shields.io/badge/gitee-files-165dff?logo=gitee)](https://gitee.com/kwooshung/Files/)
![Github Stars](https://img.shields.io/github/stars/kwooshung/Files?labelColor=272e3b&color=165dff)

<p align="center">
    <a href="README.md">English</a> | 
    <a href="README.zh-CN.md" style="font-weight:700;color:#165dff;text-decoration:underline;">中文</a>
</p>
</div>

# 为什么开发它？

- 社区中有很多优秀的文件操作库，但他们并不太适合我；
- 重新开发轮子，不代表它们不好，只是不适合我，何况我也不是为了造轮子而造轮子，我只是想要一个更适合我自己的轮子；
- 本项目中也使用了社区中优秀的项目，比如 [filehound](https://github.com/nspragg/filehound)；
- 在自己日常开发中，觉得这个轮子还不错，使用简单，所以就开源了，希望能帮助到你；

# 为什么使用它？

- 全是函数组成，使用简单；
- 所有的函数有关路径的操作，都已进行了 `标准化处理 normalize`，你不用担心路径的格式问题；
- 尽可能不使用递归，有助于处理大量文件时，避免可能出现的栈溢出；
- 可按需引入，`esm` 模块化，支持天生支持 `树摇（tree-shaking）`，不用担心打包后的体积；
- 当然本项目也提供了 `commonjs` 规范的 `cjs` 版本；
- 本项目中的所有函数，都是基于 `fs/promises` 实现；
- 只有1个第三方包依赖，`hound` 依赖于 [FileHound](https://github.com/nspragg/filehound)，用于搜索文件；如果你不需要它，可以视为 `0` 个第三方包依赖；

# 安装

## npm

```bash
npm install @kwooshung/files
```

## yarn

```bash
yarn add @kwooshung/files
```

## pnpm

```bash
pnpm add @kwooshung/files
```

# 函数列表

## [normalize](src/normalize/index.ts) 标准化路径

```ts
import { normalize } from '@kwooshung/files';

normalize('a/b/c'); // a/b/c
normalize('a//b/////c'); // a/b/c
normalize('a\\b\\c'); // a/b/c
```

## [exists](src/exists/index.ts) 检查文件或目录路径是否存在

```ts
import { exists } from '@kwooshung/files';

async () => {
  await exists('a/b/c'); // true
};
```

## [exists/not](src/exists/not/index.ts) 检查文件或目录路径是否不存在

```ts
import { notExists } from '@kwooshung/files';

async () => {
  await notExists('a/b/c/aNotExists'); // true
};
```

## [isFile](src/isFile/index.ts) 是否是一个文件

```ts
import { isFile } from '@kwooshung/files';

async () => {
  await isFile('a/b/c/test.txt'); // true
};
```

## [isDir](src/isDir/index.ts) 是否是一个目录

```ts
import { isDir } from '@kwooshung/files';

async () => {
  await isDir('a/b/c'); // true
};
```

## [makeDir](src/makeDir/index.ts) 创建目录

```ts
import { makeDir } from '@kwooshung/files';

async () => {
  await makeDir('a/b/c'); // 创建单个目录
  await makeDir(['a/b/c/1', 'd/e/f/2']); // 创建多个目录
};
```

## [getDir](src/getDir/index.ts) 获得文件目录

```ts
import { getDir } from '@kwooshung/files';

async () => {
  await getDir('a/b/c'); // 返回文件或目录路径数组
};
```

## [read](src/read/index.ts) 读取文件

```ts
import { read } from '@kwooshung/files';

async () => {
  await read('a/b/c/test.txt'); // 返回文件内容
  await read('a/b/c/test.txt', 'utf8'); // 返回文件内容，指定编码
};
```

## [write](src/write/index.ts) 写入文件

- 第三个参数默认值：`{ append: false, overwrite: true, encoding: 'utf8' }`
- 如果你使用的 `ts`，那么 第三个参数 `append` 和 `overwrite` 的类型是互斥的，即：`append` 为 `true` 时，`overwrite` 为 `false`，反之亦然。

```ts
import { write } from '@kwooshung/files';

async () => {
  await write('a/b/c/test.txt', 'hello world'); // true

  await write('a/b/c/test.txt', 'hello world', {
    append: true, // 追加，文件若不存在，则新建
    overwrite: false, // 不覆盖
    encoding: 'utf8' // 指定编码
  }); // true

  await write('a/b/c/test.txt', 'hello world', {
    append: false, // 追加
    overwrite: true // 覆盖, 文件若不存在，则新建
    encoding: 'utf8' // 指定编码
  }); // true

  await write('a/b/c/test.txt', 'hello world', {
    append: false, // 不追加
    overwrite: true // 覆盖, 文件若不存在，则新建
  }); // true

  await write('a/b/c/test.txt', 'hello world', {
    encoding: 'binary' // 指定编码
  }); // true
};
```

## [copy/file](src/copy/file/index.ts) 复制文件

只要不抛出异常，就表示复制成功，哪怕目标文件已存在。

```ts
import { copyFile } from '@kwooshung/files';

async () => {
  await copyFile('a/b/c/1.txt', 'd/e/f/2.txt'); // 表示覆盖目标文件
  await copyFile('a/b/c/1.txt', 'd/e/f/2.txt', false); // 即使目标文件已存在，虽然也不会覆盖，但是表示执行成功
};
```

## [copy/dir](src/copy/dir/index.ts) 复制目录

- 只要不抛出异常，就表示复制成功，哪怕目标目录已存在；
- 如果目标目录已存在，则是合并模式，同名文件则会覆盖，你可传入第三个参数 `false` 同名文件不会覆盖；

```ts
import { copyDir } from '@kwooshung/files';

async () => {
  await copyDir('a/b/c', 'd/e/f');
  await copyDir('a/b/c', 'd/e/f', false);
};
```

## [move/file](src/move/file/index.ts) 移动文件

移动文件，本质上是复制文件，然后删除源文件；这样做的好处是，若移动失败，源文件还在，不会丢失数据。即 `copy/file` 和 `remove` 的 功能组合

```ts
import { moveFile } from '@kwooshung/files';

async () => {
  await moveFile('a/b/c/1.txt', 'd/e/f/2.txt'); // 表示覆盖目标文件
  await moveFile('a/b/c/1.txt', 'd/e/f/2.txt', false); // 即使目标文件已存在，虽然也不会覆盖，但是表示执行成功
};
```

## [move/dir](src/move/dir/index.ts) 移动目录

复制目录，`copy/dir` 和 `remove` 的 功能组合，因此，也具有 `copy/dir` 的合并逻辑。

```ts
import { moveDir } from '@kwooshung/files';

async () => {
  await moveDir('a/b/c', 'd/e/f');
  await moveDir('a/b/c', 'd/e/f', false);
};
```

## [remove](src/remove/index.ts) 删除文件或目录

```ts
import { remove } from '@kwooshung/files';

async () => {
  await remove('a/b/c'); // 删除单个文件或目录
  await remove(['a/b/c/1', 'd/e/f/2']); // 删除多个文件或目录
};
```

## [remove/emptyDirs](src/remove/emptyDirs/index.ts) 删除指定路径的空文件夹

会删除指定路径下的所有空文件夹，包括指定路径本身。

```ts
import { removeEmptyDirs } from '@kwooshung/files';

async () => {
  await removeEmptyDirs('a/b/c'); // 删除单个文件或目录
  await removeEmptyDirs(['a/b/c/1', 'd/e/f/2']); // 删除多个文件或目录
};
```

## [size](src/size/index.ts) 获取指定路径或多个路径的体积

```ts
import { size } from '@kwooshung/files';

async () => {
  await size('a/b/c'); // [{path: 'a/b/c', size: 1200;}]
  await size(['a/b/c', 'd/e/f']); // [{path: 'a/b/c', size: 1200;}, {path: 'd/e/f', size: 2024;}]
};
```

## [size/unit](src/size/human/index.ts) 将数字，转换为带单位的体积尺寸

```ts
import { sizeHuman } from '@kwooshung/files';

sizeHuman(1024); // {size: '1.25', unit: 'KB'}
sizeHuman(1024, 3); // {size: '1.234', unit: 'KB'}
```

## [size/unit](src/size/unit/index.ts) 将指定路径或多个路径的体积，转换为带单位的文件体积

建议结合 [size](src/size/index.ts) 使用

```ts
import { sizeUnit } from '@kwooshung/files';

async () => {
  await sizeUnit({path: 'a/b/c'; size: 1024;}); // [{path: 'a/b/c', size: '1200', unit: {size: '1.2', unit: 'KB'}}]
  await sizeUnit([{path: 'a/b/c'; size: 1024;}, {path: 'd/e/f'; size: 2024;}]); // [{path: 'a/b/c', size: '1200', unit: {size: '1.2', unit: 'KB'}}, {path: 'd/e/f', size: '2024', unit: {size: '2.02', unit: 'KB'}}]
};
```

## [hound](src/hound/index.ts) 文件猎手

- [FileHound](https://github.com/nspragg/filehound) 包装器，用于创建一个新的 [FileHound](https://github.com/nspragg/filehound) 实例；
- 同时具有 `FileHound.any` 的特性，即：可以传入多个 `FileHound` 实例，返回的结果是合并的；

```
import { hound } from '@kwooshung/files';

const fh1 = hound();
fh1
  .modified("< 2 days")
  .find()
  .each(console.log);

const fh2 = FileHound.create();
filehound
  .addFilter(customFilter)
  .find()
  .each(console.log);

hound(fh1, fh2);
```
