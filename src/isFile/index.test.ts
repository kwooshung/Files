import remove from '@/remove';
import makeDir from '@/makeDir';
import write from '@/write';
import isFile from '.';

describe('isFile 函数测试', () => {
  const testDir = './testDirForFile';
  const testFile = `${testDir}/testFile.txt`;

  // 在测试前创建测试用的目录和文件
  beforeEach(async () => {
    await makeDir(testDir);
    await write(testFile, '测试文件内容');
  });

  // 测试结束后清理测试用的目录和文件
  afterEach(async () => {
    await remove([testDir, testFile]);
  });

  it('应该正确识别存在的文件', async () => {
    const result = await isFile(testFile);
    expect(result).toBe(true); // 预期是文件
  });

  it('应该正确识别非文件目录', async () => {
    const result = await isFile(testDir);
    expect(result).toBe(false); // 预期不是文件
  });

  it('应该正确处理不存在的路径', async () => {
    const result = await isFile('./不存在的路径.txt');
    expect(result).toBe(false); // 预期不是文件
  });
});
