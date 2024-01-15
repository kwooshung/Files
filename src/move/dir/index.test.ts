import { join } from 'path';
import exists from '@/exists';
import notExists from '@/notExists';
import makeDir from '@/makeDir';
import remove from '@/remove';
import read from '@/read';
import write from '@/write';
import move from '@/move/dir';

describe('@/move/dir', () => {
  const testDir = 'testMoveDir';
  const sourceDir = join(testDir, 'sourceDir');
  const targetDir = join(testDir, 'targetDir');
  const testFileName = 'testFile.txt';
  const testFilePath = join(sourceDir, testFileName);

  beforeEach(async () => {
    await makeDir(sourceDir);
    await write(testFilePath, '测试文件内容');
  });

  afterEach(async () => {
    await remove(testDir);
  });

  it('成功移动目录到新位置', async () => {
    await move(sourceDir, targetDir);
    const dirMoved = await exists(targetDir);
    expect(dirMoved).toBe(true);
    const fileMoved = await exists(join(targetDir, testFileName));
    expect(fileMoved).toBe(true);
  });

  it('移动到已存在的文件，没有开启覆盖模式，应该抛出异常', async () => {
    await write(join(sourceDir, 'test1.txt'), '原文件1');
    await write(join(sourceDir, 'test2.txt'), '原文件2');
    await write(join(targetDir, 'test1.txt'), '目标文件1');
    expect(move(sourceDir, targetDir, false)).rejects.toThrow();
  });

  it('如果目标目录已存在，并且开启了覆盖模式，那么就会自动覆盖文件', async () => {
    await write(join(sourceDir, 'test1.txt'), '原文件1');
    await write(join(sourceDir, 'test2.txt'), '原文件2');
    await write(join(targetDir, 'test1.txt'), '目标文件1');
    expect(await move(sourceDir, targetDir)).toBe(true);
    expect(await read(join(targetDir, 'test1.txt'))).toBe('原文件1');
    expect(await read(join(targetDir, 'test2.txt'))).toBe('原文件2');
    expect(await exists(targetDir)).toBe(true);
    expect(await notExists(sourceDir)).toBe(true);
  });

  it('如果源目录不存在，移动应该失败', async () => {
    const nonExistingDir = join(testDir, 'nonExistingDir');
    await expect(move(nonExistingDir, targetDir)).rejects.toThrow();
  });

  it('如果目标路径是文件，应该抛出异常', async () => {
    const targetFile = join(testDir, 'targetFile.txt');
    await write(targetFile, '目标文件内容');
    await expect(move(sourceDir, targetFile)).rejects.toThrow();
  });
});
