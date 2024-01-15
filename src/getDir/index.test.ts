import fs from 'fs/promises';
import Path from 'path';
import write from '@/write';
import remove from '@/remove';
import makeDir from '@/makeDir';
import getDir from '.';

// 测试目录路径
const testDir = Path.join(__dirname, 'testDir');

describe('@/getDir', () => {
  // 在所有测试之前创建测试目录和文件
  beforeAll(async () => {
    await makeDir(testDir);
    await write(Path.join(testDir, 'file.txt'), '这是一个测试文件');
    await makeDir(Path.join(testDir, 'subDir'));
    await write(Path.join(testDir, 'subDir', 'fileInSubDir.txt'), '这是子目录中的测试文件');
  });

  // 在所有测试之后清理测试目录
  afterAll(async () => {
    await remove(testDir);
  });

  it('空目录应返回空数组', async () => {
    const emptyDir = Path.join(testDir, 'emptyDir');
    await makeDir(emptyDir);
    const contents = await getDir(emptyDir, false, 'all');
    expect(contents).toEqual([]);
    await remove(emptyDir);
  });

  it('目录中只有文件时，应只返回文件', async () => {
    const contents = await getDir(testDir, false, 'file');
    expect(contents).toEqual([Path.join(testDir, 'file.txt')]);
  });

  it('目录中只有子目录时，应只返回子目录', async () => {
    const contents = await getDir(testDir, false, 'dir');
    expect(contents).toEqual([Path.join(testDir, 'subDir')]);
  });

  it('目录中既有文件又有子目录时，应返回所有文件和子目录', async () => {
    const contents = await getDir(testDir, false, 'all');
    expect(contents).toContain(Path.join(testDir, 'file.txt'));
    expect(contents).toContain(Path.join(testDir, 'subDir'));
  });

  it('包含子目录时，应递归返回所有子目录和文件', async () => {
    const deepSubDir = Path.join(testDir, 'subDir', 'deepSubDir');
    await makeDir(deepSubDir);
    await write(Path.join(deepSubDir, 'deepFile.txt'), '深层文件');

    const contents = await getDir(testDir, true, 'all');
    expect(contents).toContain(Path.join(deepSubDir, 'deepFile.txt'));
  });

  it('不包含子目录时，应只返回顶层目录的内容', async () => {
    await makeDir(Path.join(testDir, 'subDir'));
    const contents = await getDir(testDir, false, 'all');
    expect(contents).not.toContain(Path.join(testDir, 'subDir', 'deepSubDir'));
  });

  it('包含子目录，过滤类型为file时，应只返回文件', async () => {
    const contents = await getDir(testDir, true, 'file');
    expect(contents).toContain(Path.join(testDir, 'file.txt'));
    expect(contents).toContain(Path.join(testDir, 'subDir', 'fileInSubDir.txt'));
    expect(contents).not.toContain(Path.join(testDir, 'subDir'));
  });

  it('包含子目录，过滤类型为dir时，应只返回目录', async () => {
    const contents = await getDir(testDir, true, 'dir');
    expect(contents).not.toContain(Path.join(testDir, 'file.txt'));
    expect(contents).not.toContain(Path.join(testDir, 'subDir', 'fileInSubDir.txt'));
    expect(contents).toContain(Path.join(testDir, 'subDir'));
  });

  it('不包含子目录，过滤类型为dir时，应只返回顶层目录', async () => {
    const contents = await getDir(testDir, false, 'dir');
    expect(contents).not.toContain(Path.join(testDir, 'file.txt'));
    expect(contents).not.toContain(Path.join(testDir, 'subDir', 'fileInSubDir.txt'));
    expect(contents).toContain(Path.join(testDir, 'subDir'));
  });

  it('目录不存在时，应抛出错误', async () => {
    await expect(getDir(Path.join(testDir, 'nonExistentDir'))).rejects.toThrow();
  });

  it('fs.readdir 抛出错误时，应正确捕捉并抛出异常', async () => {
    // 模拟 fs.readdir 抛出错误
    const mockError = new Error('模拟的文件系统错误');
    vi.spyOn(fs, 'readdir').mockRejectedValue(mockError);

    await expect(getDir(testDir)).rejects.toThrow('模拟的文件系统错误');

    // 恢复原始实现
    vi.restoreAllMocks();
  });
});
