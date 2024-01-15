import { join } from 'path';
import fs from 'fs/promises';
import exists from '@/exists';
import write from '@/write';
import makeDir from '@/makeDir';
import remove from '.';

describe('@/remove', () => {
  const testDirRoot = 'testRemoveDir';

  // 创建测试目录和文件的辅助函数
  const setupTestDir = async (subDirs: string[], files: string[]) => {
    await makeDir(testDirRoot);
    for (const dir of subDirs) {
      await makeDir(join(testDirRoot, dir));
    }
    for (const file of files) {
      await write(join(testDirRoot, file), 'test data');
    }
  };

  afterAll(async () => {
    await remove(testDirRoot, true);
  });

  it('成功删除一个空目录', async () => {
    await makeDir(testDirRoot);
    const result = await remove(testDirRoot);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeFalsy();
  });

  it('成功删除一个含有文件的目录', async () => {
    await setupTestDir([], ['test.txt']);
    const result = await remove(testDirRoot);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeFalsy();
  });

  it('成功删除多个文件的目录', async () => {
    await setupTestDir([], ['test1.txt', 'test2.txt']);
    const result = await remove(testDirRoot);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeFalsy();
  });

  it('成功删除多个目录', async () => {
    await setupTestDir([], ['one/aaa.txt', 'two/bbb.txt']);
    const result = await remove([join(testDirRoot, 'one'), join(testDirRoot, 'two')]);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeTruthy();
  });

  it('成功删除一个含有子目录和文件的目录', async () => {
    await setupTestDir(['subDir'], ['test.txt', 'subDir/subTest.txt']);
    const result = await remove(testDirRoot, true);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeFalsy();
  });

  it('删除不存在的文件或目录', async () => {
    const result = await remove('nonExistentPath');
    expect(result).toBeTruthy();
  });

  it('不删除子目录的情况', async () => {
    await setupTestDir(['subDir'], ['test.txt', 'subDir/subTest.txt']);
    expect(await remove(testDirRoot, false)).toBeTruthy();
  });

  it('删除包含多层子目录的目录', async () => {
    await setupTestDir(['subDir1', 'subDir1/subDir2'], ['subDir1/subDir2/test.txt']);
    const result = await remove(testDirRoot, true);
    expect(result).toBeTruthy();
    expect(await exists(testDirRoot)).toBeFalsy();
  });

  it('处理无效路径的异常', async () => {
    const invalidPath = 'path/does/not/exist';
    expect(await remove(invalidPath)).toBeTruthy();
  });

  it('尝试触发异常，抛出标准错误', async () => {
    await setupTestDir([], ['error1.txt']);
    const error = new Error();
    vi.spyOn(fs, 'unlink').mockRejectedValueOnce(error);

    expect(remove(testDirRoot)).rejects.toThrow();
  });

  it('尝试触发异常，非标准错误，直接返回false', async () => {
    await setupTestDir([], ['error2.txt']);
    vi.spyOn(fs, 'unlink').mockRejectedValueOnce({ abc: 123 });
    expect(await remove(testDirRoot)).toBeFalsy();
  });
});
