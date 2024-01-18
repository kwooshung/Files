import remove from '@/remove';
import makeDir from '@/makeDir';
import write from '@/write';
import isDir from '.';

describe('@/isDir', () => {
  const testDir = './testDir';
  const testFile = `${testDir}/testFile.txt`;

  beforeEach(async () => {
    await makeDir(testDir);
    await write(testFile, '测试文件内容');
  });

  afterEach(async () => {
    await remove([testDir, testFile]);
  });

  it('应该正确识别存在的目录', async () => {
    const result = await isDir(testDir);
    expect(result).toBeTruthy();
  });

  it('应该正确识别非目录文件', async () => {
    const result = await isDir(testFile);
    expect(result).toBeFalsy();
  });

  it('应该正确处理不存在的路径', async () => {
    const result = await isDir('./不存在的路径');
    expect(result).toBeFalsy();
  });
});
