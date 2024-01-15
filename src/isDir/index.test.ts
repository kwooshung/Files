import remove from '@/remove';
import makeDir from '@/makeDir';
import write from '@/write';
import isDir from '.';

describe('@/isDir', () => {
  const testDir = './testDir';
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

  it('应该正确识别存在的目录', async () => {
    const result = await isDir(testDir);
    expect(result).toBeTruthy(); // 预期是目录
  });

  it('应该正确识别非目录文件', async () => {
    const result = await isDir(testFile);
    expect(result).toBeFalsy(); // 预期不是目录
  });

  it('应该正确处理不存在的路径', async () => {
    const result = await isDir('./不存在的路径');
    expect(result).toBeFalsy(); // 预期不是目录
  });
});
