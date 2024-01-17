import moveDir from '.';
import { join } from 'path';
import makeDir from '@/makeDir';
import write from '@/write';
import exists from '@/exists';
import remove from '@/remove';

describe('@/move/dir', () => {
  const testDirPath = 'test-move-dir';
  const srcDir = join(testDirPath, 'source');
  const targetDir = join(testDirPath, 'target');
  const testFilePath = join(srcDir, 'test.txt');
  const targetFilePath = join(targetDir, 'test.txt');

  // 创建测试目录和文件
  beforeAll(async () => {
    await makeDir(srcDir);
    await write(testFilePath, '测试内容');
  });

  // 清理测试目录
  afterAll(async () => {
    await remove(testDirPath);
  });

  it('移动目录到新位置', async () => {
    const result = await moveDir(srcDir, targetDir);
    expect(result).toBeTruthy();
    const sourceExists = await exists(srcDir);
    expect(sourceExists).toBeFalsy();
    const targetExists = await exists(targetDir);
    expect(targetExists).toBeTruthy();
    const fileMoved = await exists(targetFilePath);
    expect(fileMoved).toBeTruthy();
  });

  it('当源目录不存在时，抛出错误', async () => {
    await expect(moveDir('nonexistent', targetDir)).rejects.toThrow();
  });

  it('当目标目录已存在且不覆盖时，应当返回 true', async () => {
    await makeDir(srcDir);
    await write(testFilePath, '测试内容');
    expect(await moveDir(srcDir, targetDir, false)).toBeTruthy();
  });

  it('当目标目录已存在且覆盖时，移动成功', async () => {
    await makeDir(srcDir);
    await write(testFilePath, '测试内容');
    const result = await moveDir(srcDir, targetDir, true);
    expect(result).toBeTruthy();
  });
});
