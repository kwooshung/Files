import fs from 'fs/promises';
import remove from '@/remove';
import read from '@/read';
import write from '.';

describe('@/write', () => {
  const testFile = 'testWrite.txt';
  const testContent = '测试写入内容';
  const appendContent = '追加的内容';

  afterEach(async () => {
    await remove(testFile);
  });

  it('成功写入文件内容', async () => {
    await write(testFile, testContent);
    const content = await read(testFile);
    expect(content).toBe(testContent);
  });

  it('文件已存在，不追加且不覆盖时，应该报出异常', async () => {
    // 首先创建文件
    await write(testFile, testContent);
    // 尝试再次写入相同文件，不允许覆盖且不追加，预期会抛出异常
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(write(testFile, '新内容', { append: false, overwrite: false })).rejects.toThrow('The file already exists and does not overwrite or append, so it cannot be written.');
  });

  it('文件已存在时，在末尾追加内容', async () => {
    // 首先创建文件
    await write(testFile, testContent);
    // 追加内容到文件
    await write(testFile, appendContent, { append: true, overwrite: false });
    // 读取文件内容
    const content = await read(testFile);
    expect(content).toBe(testContent + appendContent);
  });

  it('文件不存在时，append 应创建文件并写入内容', async () => {
    // 文件不存在，使用 append 写入
    await write(testFile, testContent, { append: true, overwrite: false });
    // 读取文件内容
    const content = await read(testFile);
    expect(content).toBe(testContent);
  });

  it('遇到 EEXIST 错误代码时应当正常返回 true', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'EEXIST'; // 一个典型的 EEXIST 错误代码
    jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(write(testFile, 'EEXIST', { append: false, overwrite: false })).rejects.toThrow('The file already exists and does not overwrite or append, so it cannot be written.');
  });

  it('文件已存在，且允许追加或覆盖，则返回 true', async () => {
    const error = new Error('Some error') as NodeJS.ErrnoException;
    error.code = 'EEXIST'; // 一个典型的非 EEXIST 错误代码
    jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(error);
    expect(await write(testFile, 'EEXIST', { append: true, overwrite: false })).toBeTruthy();
  });
});
