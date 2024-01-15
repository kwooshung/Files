import { join } from 'path';
import fs from 'fs/promises';
import exists from '@/exists';
import notExists from '@/notExists';
import write from '@/write';
import makeDir from '@/makeDir';
import remove from '@/remove';
import emptyDirs from '.';

describe('@/remove/emptyDirs', () => {
  const testDirRoot = 'testEmptyDir';

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

  it('成功查找到空目录，空目录删除后，根目录也空了，那么就会删除根目录', async () => {
    await setupTestDir(['empty1', 'empty2', 'empty3', 'empty4'], []);

    expect(await emptyDirs(testDirRoot)).toBeTruthy();
    expect(await notExists(testDirRoot)).toBeTruthy();
  });

  it('成功查找到空目录，并删除', async () => {
    await setupTestDir(['empty1', 'empty2', 'empty3', 'empty4'], ['abc.txt', 'nonempty1/abc.txt', 'nonempty2/abc.txt', 'nonempty3/abc.txt', 'nonempty4/abc.txt']);

    expect(await emptyDirs(testDirRoot)).toBeTruthy();
  });

  it('成功查找到多个空目录，并删除', async () => {
    await setupTestDir(['empty1/a', 'empty2/b', 'empty3/c', 'empty2/a', 'empty2/b', 'empty2/c'], []);

    expect(await emptyDirs([join(testDirRoot, 'empty1'), join(testDirRoot, 'empty2')])).toBeTruthy();
  });

  it('处理不存在的目录', async () => {
    await expect(emptyDirs('nonExistingDir')).rejects.toThrow();
  });

  it('处理非目录路径', async () => {
    const filePath = join(testDirRoot, 'file.txt');
    await write(filePath, 'test data');
    await expect(emptyDirs(filePath)).rejects.toThrow();
  });

  it('删除多层嵌套的空目录', async () => {
    await setupTestDir(['nested1/nested2/nested3', 'nested1/nested2/nonempty'], ['nested1/nested2/nonempty/abc.txt']);
    const result = await emptyDirs(join(testDirRoot, 'nested1'));
    const nested3Exists = await exists(join(testDirRoot, 'nested1/nested2/nested3'));
    const nonEmptyExists = await exists(join(testDirRoot, 'nested1/nested2/nonempty'));

    expect(result).toBeTruthy();
    expect(nested3Exists).toBeFalsy();
    expect(nonEmptyExists).toBeTruthy();
  });

  it('尝试删除不存在的目录', async () => {
    const nonExistingPath = join(testDirRoot, 'nonExisting');
    await expect(emptyDirs(nonExistingPath)).rejects.toThrow();
  });

  it('尝试删除文件而不是目录', async () => {
    const filePath = join(testDirRoot, 'file.txt');
    await setupTestDir([], [filePath]);
    await expect(emptyDirs(filePath)).rejects.toThrow();
  });

  it('处理删除过程中发生的异常', async () => {
    vi.spyOn(fs, 'readdir').mockImplementationOnce(() => {
      throw new Error('模拟读取目录时的错误');
    });
    const testPath = join(testDirRoot, 'test');
    await makeDir(testPath);
    await expect(emptyDirs(testPath)).rejects.toThrow();
  });

  it('空目录与非空目录混合，只删除空目录', async () => {
    await setupTestDir(['empty', 'nonempty'], ['nonempty/file.txt']);
    expect(await emptyDirs(testDirRoot)).toBeTruthy();
    expect(await exists(join(testDirRoot, 'nonempty'))).toBeTruthy();
    expect(await notExists(join(testDirRoot, 'empty'))).toBeTruthy();
  });
});
