import fs from 'fs/promises';
import remove from '@/remove';
import read from '@/read';
import write from '@/write';
import copy from '@/copy/file';

describe('@/copy/file', () => {
  const sourceFile = 'testCopyFileSource.txt';
  const targetFile = 'testCopyFileTarget.txt';
  const testContent = '测试复制内容';

  beforeEach(async () => {
    await write(sourceFile, testContent);
  });

  afterEach(async () => {
    await remove([sourceFile, targetFile]);
  });

  it('成功复制文件内容', async () => {
    const result = await copy(sourceFile, targetFile);
    expect(result).toBeTruthy();
    const content = await read(targetFile);
    expect(content).toBe(testContent);
  });

  it('当源路径或目标路径为空时应抛出错误', async () => {
    await expect(copy('', targetFile)).rejects.toThrow();
    await expect(copy(sourceFile, '')).rejects.toThrow();
  });

  it('当源文件和目标文件路径相同时应返回 true', async () => {
    const result = await copy(sourceFile, sourceFile);
    expect(result).toBeTruthy();
  });

  it('尝试复制到同一位置，什么都不处理，也应该是成功', async () => {
    const result = await copy(sourceFile, sourceFile);
    expect(result).toBeTruthy();
  });

  it('复制到已存在的文件应失败', async () => {
    await write(targetFile, '已存在的内容');
    await expect(copy(sourceFile, targetFile)).rejects.toThrow();
  });

  // 新增覆盖选项的测试
  it('启用覆盖选项时，应成功覆盖已存在的目标文件', async () => {
    await write(targetFile, '原始内容');
    const overwrite = true;
    const result = await copy(sourceFile, targetFile, overwrite);
    expect(result).toBeTruthy();
    const content = await read(targetFile);
    expect(content).toBe(testContent);
  });

  it('源文件不存在时应抛出错误', async () => {
    await remove(sourceFile);
    await expect(copy('nonexistent.txt', targetFile)).rejects.toThrow();
  });

  it('目标文件已存在，但不覆盖时应抛出错误', async () => {
    await write(targetFile, '原始内容');
    const overwrite = false;
    await expect(copy(sourceFile, targetFile, overwrite)).rejects.toThrow();
  });

  it('文件权限问题时应抛出错误', async () => {
    // 模拟文件权限问题
    vi.spyOn(fs, 'copyFile').mockImplementationOnce(() => Promise.reject(new Error('权限错误')));
    await expect(copy(sourceFile, targetFile)).rejects.toThrow('权限错误');
  });

  it('磁盘空间不足时应抛出错误', async () => {
    // 模拟磁盘空间不足
    vi.spyOn(fs, 'copyFile').mockImplementationOnce(() => Promise.reject(new Error('磁盘空间不足')));
    await expect(copy(sourceFile, targetFile)).rejects.toThrow('磁盘空间不足');
  });

  it('源文件和目标文件是同一文件的不同路径表示时应处理正确', async () => {
    const relativePath = './' + sourceFile;
    const result = await copy(relativePath, sourceFile);
    expect(result).toBeTruthy();
  });
});
