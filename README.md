<div align="center">

# @kwooshung/files

![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/kwooshung/files?labelColor=272e3b&color=00b42A&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/kwooshung/files?labelColor=272e3b&color=165dff)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kwooshung/files?labelColor=272e3b&color=165dff)
![GitHub top language](https://img.shields.io/github/languages/top/kwooshung/files?labelColor=272e3b&color=165dff)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kwooshung/files?labelColor=272e3b&color=165dff)
![GitHub issues](https://img.shields.io/github/issues/kwooshung/files?labelColor=272e3b&color=165dff)
[![NPM Version](https://img.shields.io/npm/v/@kwooshung/files?labelColor=272e3b&color=165dff)](https://www.npmjs.com/package/@kwooshung/files)
[![Npm.js Downloads/Week](https://img.shields.io/npm/dw/@kwooshung/files?labelColor=272e3b&labelColor=272e3b&color=165dff&logo=npm)](https://www.npmjs.com/package/@kwooshung/files)
[![Github CI/CD](https://github.com/kwooshung/files/actions/workflows/ci.yml/badge.svg)](https://github.com/kwooshung/files/actions/)
[![codecov](https://codecov.io/gh/kwooshung/files/graph/badge.svg?token=VVZJE7H0KD)](https://codecov.io/gh/kwooshung/files)
[![Maintainability](https://api.codeclimate.com/v1/badges/325d0881b1ca19165d35/maintainability)](https://codeclimate.com/github/kwooshung/files/maintainability/)
[![GitHub License](https://img.shields.io/github/license/kwooshung/files?labelColor=272e3b&color=165dff)](LICENSE)
[![Gitee Repo](https://img.shields.io/badge/gitee-files-165dff?logo=gitee)](https://gitee.com/kwooshung/files/)
![Github Stars](https://img.shields.io/github/stars/kwooshung/files?labelColor=272e3b&color=165dff)

<p align="center">
    <a href="README.zh-CN.md">中文</a> | 
    <a href="README.md" style="font-weight:700;color:#165dff;text-decoration:underline;">English</a>
</p>
</div>

# Why Develop It?

- There are many excellent file operation libraries in the community, but they were not quite suitable for me.
- Developing a new wheel doesn't mean the existing ones are bad; it's just about creating something more suited to my needs. I'm not creating a wheel for the sake of it, but rather to have a wheel that fits my requirements better.
- This project also utilizes some excellent community projects, such as [filehound](https://github.com/nspragg/filehound).
- I found this tool quite useful in my daily development. It's simple to use, which is why I decided to open-source it, hoping it could help others.

# Why Use It?

- It's composed entirely of functions, making it easy to use.
- All functions related to path operations are `normalized`, so you don't have to worry about the format of the paths.
- As much as possible, recursion is avoided, which helps when dealing with a large number of files and prevents potential stack overflows.
- You can import as needed; it supports `tree-shaking` as an `esm` module, so you don't need to worry about the size after packaging.
- There is also a `commonjs` (`cjs`) version available for those using the `commonjs` specification.
- All functions in this project are based on `fs/promises`.
- There is only 1 third-party dependency, `hound`, which relies on [FileHound](https://github.com/nspragg/filehound) for file searching. If you don't need it, you can consider it as `0` third-party dependencies.

# Install

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

# Functions

## [normalize](src/normalize/index.ts) Normalize Path

```ts
import { normalize } from '@kwooshung/files';

normalize('a/b/c'); // a/b/c
normalize('a//b/////c'); // a/b/c
normalize('a\\b\\c'); // a/b/c
```

## [exists](src/exists/index.ts) Check if File or Directory Path Exists

```ts
import { exists } from '@kwooshung/files';

async () => {
  await exists('a/b/c'); // true
};
```

## [exists/not](src/exists/not/index.ts) Check if File or Directory Path Does Not Exist

```ts
import { notExists } from '@kwooshung/files';

async () => {
  await notExists('a/b/c/aNotExists'); // true
};
```

## [isFile](src/isFile/index.ts) Check if Path is a File

```ts
import { isFile } from '@kwooshung/files';

async () => {
  await isFile('a/b/c/test.txt'); // true
};
```

## [isDir](src/isDir/index.ts) Check if Path is a Directory

```ts
import { isDir } from '@kwooshung/files';

async () => {
  await isDir('a/b/c'); // true
};
```

## [makeDir](src/makeDir/index.ts) Create Directory

```ts
import { makeDir } from '@kwooshung/files';

async () => {
  await makeDir('a/b/c'); // Create a single directory
  await makeDir(['a/b/c/1', 'd/e/f/2']); // Create multiple directories
};
```

## [getDir](src/getDir/index.ts) Get Directory

```ts
import { getDir } from '@kwooshung/files';

async () => {
  await getDir('a/b/c'); // Returns an array of file or directory paths
};
```

## [read](src/read/index.ts) Read File

```ts
import { read } from '@kwooshung/files';

async () => {
  await read('a/b/c/test.txt'); // Returns the file content, the encoding is utf8 by default
  await read('a/b/c/test.txt', 'utf8'); // Returns the file content, specifying the encoding
};
```

## [write](src/write/index.ts) Write to File

- The third parameter has a default value of `{ append: false, overwrite: true, encoding: 'utf8' }`
- If you are using `ts`, then the types of the third parameter `append` and `overwrite` are mutually exclusive, i.e.: when `append` is `true`, `overwrite` is `false`, and vice versa.

```ts
import { write } from '@kwooshung/files';

async () => {
  await write('a/b/c/test.txt', 'hello world'); // true

  await write('a/b/c/test.txt', 'hello world', {
    append: true, // Append
    overwrite: false, // Not Overwrite
    encoding: 'utf8' // Specify encoding
  }); // true


  await write('a/b/c/test.txt', 'hello world', {
    append: false, // Not Append
    overwrite: true // Overwrite, if the file does not exist, it will be created
    encoding: 'utf8' // Specify encoding
  }); // true

  await write('a/b/c/test.txt', 'hello world', {
    append: false, // Not Append
    overwrite: true // Overwrite, if the file does not exist, it will be created
  }); // true

  await write('a/b/c/test.txt', 'hello world', {
    encoding: 'binary' // Specify encoding
  }); // true
};
```

## [copy/file](src/copy/file/index.ts) Copy File

As long as no exception is thrown, the copy is successful, even if the target file already exists.

```ts
import { copyFile } from '@kwooshung/files';

async () => {
  await copyFile('a/b/c/1.txt', 'd/e/f/2.txt'); // 表示覆盖目标文件
  await copyFile('a/b/c/1.txt', 'd/e/f/2.txt', false); // 即使目标文件已存在，虽然也不会覆盖，但是表示执行成功
};
```

## [copy/dir](src/copy/dir/index.ts) Copy Directory

- If no exception is thrown, it means the copy was successful, even if the target directory already exists.
- If the target directory exists, it will merge with the source. Identical files will be overwritten, but you can pass `false` as the third argument to prevent overwriting.

```ts
import { copyDir } from '@kwooshung/files';

async () => {
  await copyDir('a/b/c', 'd/e/f');
  await copyDir('a/b/c', 'd/e/f', false);
};
```

## [move/file](src/move/file/index.ts) Move File

Moving a file essentially copies the file and then deletes the source file. This approach ensures that if the move fails, the source file remains intact. It's a combination of `copy/file` and `remove`.

```ts
import { moveFile } from '@kwooshung/files';

async () => {
  await moveFile('a/b/c/1.txt', 'd/e/f/2.txt'); // 表示覆盖目标文件
  await moveFile('a/b/c/1.txt', 'd/e/f/2.txt', false); // 即使目标文件已存在，虽然也不会覆盖，但是表示执行成功
};
```

## [move/dir](src/move/dir/index.ts) Move Directory

Moving a directory combines the functionalities of `copy/dir` and `remove`, thus it also follows the merging logic of `copy/dir`.

```ts
import { moveDir } from '@kwooshung/files';

async () => {
  await moveDir('a/b/c', 'd/e/f');
  await moveDir('a/b/c', 'd/e/f', false);
};
```

## [remove](src/remove/index.ts) Delete File or Directory

```ts
import { remove } from '@kwooshung/files';

async () => {
  await remove('a/b/c'); // Delete a single file or directory
  await remove(['a/b/c/1', 'd/e/f/2']); // Delete multiple files or directories
};
```

## [remove/emptyDirs](src/remove/emptyDirs/index.ts) Delete Empty Directories at a Specified Path

This will delete all empty directories under the specified path, including the path itself.

```ts
import { removeEmptyDirs } from '@kwooshung/files';

async () => {
  await removeEmptyDirs('a/b/c'); // Delete a single file or directory
  await removeEmptyDirs(['a/b/c/1', 'd/e/f/2']); // Delete multiple files or directories
};
```

## [size](src/size/index.ts) Get the Size of a Specified Path or Multiple Paths

```ts
import { size } from '@kwooshung/files';

async () => {
  await size('a/b/c'); // [{path: 'a/b/c', size: 1200;}]
  await size(['a/b/c', 'd/e/f']); // [{path: 'a/b/c', size: 1200;}, {path: 'd/e/f', size: 2024;}]
};
```

## [size/unit](src/size/human/index.ts) Convert a Number to a Human-Readable Size

```ts
import { sizeHuman } from '@kwooshung/files';

sizeHuman(1024); // {size: '1.25', unit: 'KB'}
sizeHuman(1024, 3); // {size: '1.234', unit: 'KB'}
```

## [size/unit](src/size/unit/index.ts) Convert the Size of Specified Paths to Human-Readable Format

recommended to use with [size](src/size/index.ts)

```ts
import { sizeUnit } from '@kwooshung/files';

async () => {
  await sizeUnit({path: 'a/b/c'; size: 1024;}); // [{path: 'a/b/c', size: '1200', unit: {size: '1.2', unit: 'KB'}}]
  await sizeUnit([{path: 'a/b/c'; size: 1024;}, {path: 'd/e/f'; size: 2024;}]); // [{path: 'a/b/c', size: '1200', unit: {size: '1.2', unit: 'KB'}}, {path: 'd/e/f', size: '2024', unit: {size: '2.02', unit: 'KB'}}]
};
```

## [hound](src/hound/index.ts) FileHound

- A wrapper for [FileHound](https://github.com/nspragg/filehound), used for creating a new instance of [FileHound](https://github.com/nspragg/filehound);
- Also features the capabilities of `FileHound.any`, which means: multiple `FileHound` instances can be passed in, and the results will be merged;

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
