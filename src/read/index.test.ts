import fs from 'fs/promises';
import { join } from 'path';
import remove from '@/remove';
import write from '@/write';
import read from '.';

describe('@/read', () => {
  const testDirRoot = 'testWriteDir';
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

  it('遇到错误代码时，应当抛出异常', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    vi.spyOn(fs, 'readFile').mockRejectedValueOnce(error);
    expect(await read(testFilePath)).toBe('');
  });
});
