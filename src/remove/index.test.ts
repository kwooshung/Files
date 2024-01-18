import { join } from 'path';
import fs from 'fs/promises';
import exists from '@/exists';
import makeDir from '@/makeDir';
import write from '@/write';
import remove from '@/remove';

describe('@/remove', () => {
  const testDir = 'test-remove';
  const testFile = join(testDir, 'test.txt');

  beforeAll(async () => {
    await makeDir(testDir);
    await write(testFile, '这是一个测试文件');
  });

  afterAll(async () => {
    await remove(testDir);
  });

  it('应该能够删除文件', async () => {
    const result = await remove(testFile);
    expect(result).toBeTruthy();
    expect(await exists(testFile)).toBeFalsy();
  });

  it('应该能够删除目录', async () => {
    const result = await remove(testDir);
    expect(result).toBeTruthy();
    expect(await exists(testDir)).toBeFalsy();
  });

  it('删除不存在的文件或目录时应返回 true', async () => {
    const result = await remove('不存在的文件或目录');
    expect(result).toBeTruthy();
  });

  it('尝试删除非空目录应该返回 false', async () => {
    const nonEmptyDir = join(testDir, 'non-empty');
    await makeDir(nonEmptyDir);
    await write(join(nonEmptyDir, 'file.txt'), '非空目录的文件');

    const result = await remove(nonEmptyDir);
    expect(result).toBeTruthy();
  });

  it('删除多个路径', async () => {
    const path1 = join(testDir, 'path1');
    const path2 = join(testDir, 'path2');
    const path3 = join(testDir, 'path3');
    const file1 = join(testDir, 'a', 'a.txt');
    const file2 = join(testDir, 'b', 'b.txt');
    const file3 = join(testDir, 'c', 'c.txt');

    await makeDir(path1);
    await makeDir(path2);
    await makeDir(path3);

    await write(file1, 'a');
    await write(file2, 'b');
    await write(file3, 'c');

    const result = await remove([path1, path2, path3, file1, file2, file3]);
    expect(result).toBeTruthy();
  });

  it('不会删除子目录', async () => {
    const basePath = join(testDir, 'includeSubDirs');
    const path1 = join(basePath, 'a', 'a.txt');
    const path2 = join(basePath, 'b', 'b.txt');
    const path3 = join(basePath, 'c', 'c.txt');
    const path4 = join(basePath, 'd');

    await write(path1, 'a');
    await write(path2, 'b');
    await write(path3, 'c');
    await makeDir(path4);

    const result = await remove(basePath, false);
    expect(result).toBeTruthy();
    expect(await exists([path1, path2, path3, path4])).toBeTruthy();
  });

  it('处理删除不存在的文件或目录的情况', async () => {
    const nonExistentPath = join(testDir, 'non-existent');
    const result = await remove(nonExistentPath);
    expect(result).toBeTruthy();
  });

  it('处理无效路径的，应该返回 true', async () => {
    const invalidPath = 'path/does/not/exist';
    expect(await remove(invalidPath)).toBeTruthy();
  });

  it('尝试触发异常，抛出标准错误', async () => {
    await write(join(testDir, 'error', 'error1.txt'), 'error1');
    const error = new Error();
    jest.spyOn(fs, 'unlink').mockRejectedValueOnce(error);

    let err: Error;

    try {
      await remove(join(testDir, 'error'));
    } catch (e) {
      err = e;
    }

    expect(err).toBe(error);
  });

  it('尝试触发异常，非标准错误，直接返回false', async () => {
    await write(join(testDir, 'error', 'error2.txt'), 'error2');
    jest.spyOn(fs, 'unlink').mockRejectedValueOnce({ abc: 123 });
    expect(await remove(join(testDir, 'error'))).toBeFalsy();
  });
});
