import path from 'path';
import remove from '@/remove';
import exists from '@/exists';
import makeDir from '.';

describe('@/makeDir', () => {
  const testDirRoot = 'testCreateDir';

  // 在每个测试后清理测试目录
  afterEach(async () => {
    console.log('应该删除');
    await remove(testDirRoot, true);
  });

  // 测试创建单层目录
  it('应当成功创建单层目录', async () => {
    const dirPath = path.join(testDirRoot, 'singleDir');
    await makeDir(dirPath);
    expect(await exists(dirPath)).toBe(true);
  });

  // 测试创建多层目录
  it('应当成功创建多层目录', async () => {
    const dirPath = path.join(testDirRoot, 'multi/level/dir');
    await makeDir(dirPath);
    expect(await exists(dirPath)).toBe(true);
  });

  // 测试为文件创建目录
  it('应当成功为文件创建所在目录', async () => {
    const filePath = path.join(testDirRoot, 'fileDir/file.txt');
    await makeDir(filePath);
    expect(await exists(path.dirname(filePath))).toBe(true);
  });
});
