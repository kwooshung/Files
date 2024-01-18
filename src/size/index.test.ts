import { join } from 'path';
import makeDir from '@/makeDir';
import write from '@/write';
import remove from '@/remove';
import size from '.';

describe('@/size', () => {
  const testDir = 'test-size';
  const testFile = join(testDir, 'test.txt');
  const testSubDir = join(testDir, 'subdir');
  const testSubFile = join(testSubDir, 'subfile.txt');

  beforeAll(async () => {
    await makeDir(testDir);
    await write(testFile, 'Hello World');
    await makeDir(testSubDir);
    await write(testSubFile, 'Another file');
  });

  afterAll(async () => {
    await remove(testDir);
  });

  it('获取文件大小', async () => {
    const results = await size(testFile);
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe(testFile);
    expect(results[0].size).toBeGreaterThan(0);
  });

  it('获取目录大小', async () => {
    const results = await size(testDir);
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe(testDir);
    expect(results[0].size).toBeGreaterThan(0);
  });

  it('获取多个路径的大小', async () => {
    const results = await size([testFile, testSubDir]);
    expect(results).toHaveLength(2);
    results.forEach((result) => {
      expect(result.size).toBeGreaterThan(0);
    });
  });

  it('测试大整数选项', async () => {
    const results = await size(testFile, true);
    expect(typeof results[0].size).toBe('bigint');
  });

  it('处理不存在的路径', async () => {
    const results = await size('nonexistent/path');
    expect(results[0].path).toBe(join('nonexistent', 'path'));
    expect(results[0].size).toBe(0);
  });
});
