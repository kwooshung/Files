import { join } from 'path';
import remove from '@/remove';
import makeDir from '@/makeDir';
import write from '@/write';
import exists from '@/exists';

describe('@/exists', () => {
  const testDir = 'test-exists';
  const testFilePath = join(testDir, 'file.txt');
  const nonExistentPath = join(testDir, 'nonexistent.txt');

  beforeAll(async () => {
    await makeDir(testDir);
    await write(testFilePath, 'Hello World');
  });

  afterAll(async () => {
    await remove(testDir);
  });

  it('检查单个存在的文件路径', async () => {
    expect(await exists(testFilePath)).toBeTruthy();
  });

  it('检查单个不存在的文件路径', async () => {
    expect(await exists(nonExistentPath)).toBeFalsy();
  });

  it('检查多个路径，全部存在', async () => {
    expect(await exists([testFilePath, testDir])).toBeTruthy();
  });

  it('检查多个路径，至少一个存在', async () => {
    expect(await exists([testFilePath, nonExistentPath], true)).toBeTruthy();
  });

  it('检查多个路径，全部不存在', async () => {
    expect(await exists([nonExistentPath, join(testDir, 'anotherNonexistent.txt')])).toBeFalsy();
  });
});
