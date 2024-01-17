import fs from 'fs/promises';
import { join } from 'path';
import mkdir from '@/makeDir';
import remove from '@/remove';
import write from '@/write';
import read from '.';

describe('@/read', () => {
  const testDirRoot = 'testReadDir';
  const testFilePath = join(testDirRoot, 'test.txt');

  afterEach(async () => {
    await remove(testDirRoot);
  });

  it('读取文件内容', async () => {
    const testContent = '测试内容';

    await write(testFilePath, testContent);
    const content = await read(testFilePath);
    expect(content).toBe(testContent);
  });

  it('读取不存在的文件内容', async () => {
    const testContent = '';

    const content = await read(testFilePath);
    expect(content).toBe(testContent);
  });

  it('如果文件不存在应该返回空字符串', async () => {
    const nonExistentFilePath = join(testDirRoot, 'nonExistentFile.txt');
    const content = await read(nonExistentFilePath);
    expect(content).toBe('');
  });

  it('应该能够正确读取非默认编码格式的文件', async () => {
    const content = '这是一段测试文本';
    const encodedFilePath = join(testDirRoot, 'encodedFile.txt');
    await write(encodedFilePath, content, false, true, 'utf16le');
    const readContent = await read(encodedFilePath, 'utf16le');
    expect(readContent).toBe(content);
  });

  it('读取的不是文件，应该返回空字符串', async () => {
    await mkdir(join(testDirRoot, 'abc'));
    const errorFilePath = join(testDirRoot, 'abc');
    expect(await read(errorFilePath)).toBe('');
  });

  it('读取文件时发生错误，应该返回空字符串', async () => {
    const errorFilePath = join(testDirRoot, 'errorFile.txt');
    jest.spyOn(fs, 'readFile').mockRejectedValueOnce(new Error('读取文件错误'));
    expect(await read(errorFilePath)).toBe('');
  });

  it('遇到错误代码时，应该返回空字符串', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    jest.spyOn(fs, 'readFile').mockRejectedValueOnce(error);
    expect(await read(testFilePath)).toBe('');
  });

  it('抛出非 NodeJS.ErrnoException 类型，应该返回空字符串', async () => {
    jest.spyOn(fs, 'readFile').mockRejectedValueOnce({ abc: 123 });
    expect(await read(join(testDirRoot, 'nonErrnoErrorDir'))).toBe('');
  });
});
