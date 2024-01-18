import { join, dirname } from 'path';
import fs from 'fs/promises';
import remove from '@/remove';
import exists from '@/exists';
import makeDir from '.';

describe('@/await makeDir', () => {
  const testDirRoot = 'testMakeDir';

  afterEach(async () => {
    await remove(testDirRoot, true);
  });

  it('成功创建单层目录', async () => {
    const dirPath = join(testDirRoot, 'singleDir');
    await makeDir(dirPath);
    expect(exists(dirPath)).toBeTruthy();
  });

  it('成功创建多层目录', async () => {
    const dirPath = join(testDirRoot, 'multi', 'level', 'dir');
    await makeDir(dirPath);
    expect(exists(dirPath)).toBeTruthy();
  });

  it('成功创建多个多层目录', async () => {
    const dirs = [join(testDirRoot, 'a', 'b', 'c'), join(testDirRoot, '1', '2', '3')];
    await makeDir(dirs);
    expect(exists(dirs)).toBeTruthy();
  });

  it('成功为文件创建所在目录', async () => {
    const filePath = join(testDirRoot, 'fileDir', 'file.txt');
    await makeDir(filePath);
    expect(exists(dirname(filePath))).toBeTruthy();
  });

  it('目录已存在时返回true', async () => {
    const dirPath = join(testDirRoot, 'existingDir');
    await makeDir(dirPath); // 首次创建目录
    expect(await makeDir(dirPath)).toBeTruthy(); // 再次创建同一目录
  });

  it('路径为文件时，正常创建对应目录', async () => {
    expect(await makeDir(`${testDirRoot}/file.txt`)).toBeTruthy();
  });

  it('err 不是 NodeJS.ErrnoException 实例时应当 返回 false', async () => {
    jest.spyOn(fs, 'mkdir').mockRejectedValueOnce('Just a string');
    const dirPath = join(testDirRoot, 'weirdErrorDir');
    expect(await makeDir(dirPath)).toBeFalsy();
  });

  it('非法路径上抛出异常', async () => {
    const invalidPath = 'some\0illegalpath';
    expect(await makeDir(invalidPath)).toBeFalsy();
  });

  it('遇到文件系统错误时抛出异常', async () => {
    jest.spyOn(fs, 'mkdir').mockRejectedValueOnce(new Error('File system error'));
    const dirPath = join(testDirRoot, 'errorDir');
    expect(makeDir(dirPath)).rejects.toThrow('File system error');
  });

  it('遇到 EEXIST 错误代码时,应当正常返回 true', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'EEXIST'; // 一个典型的 EEXIST 错误代码
    jest.spyOn(fs, 'mkdir').mockRejectedValueOnce(error);
    const dirPath = join(testDirRoot, 'existentDir');
    expect(await makeDir(dirPath)).toBeTruthy();
  });

  it('遇到错误代码时，应当抛出异常', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'ENOENT'; // 一个典型的错误代码
    jest.spyOn(fs, 'mkdir').mockRejectedValueOnce(error);
    const dirPath = join(testDirRoot, 'nonexistentDir');
    expect(makeDir(dirPath)).rejects.toThrow('Some error');
  });

  it('抛出非 NodeJS.ErrnoException 类型的错误', async () => {
    jest.spyOn(fs, 'mkdir').mockRejectedValueOnce({ abc: 123 });
    expect(await makeDir(join(testDirRoot, 'nonErrnoErrorDir'))).toBeFalsy();
  });
});
