import exists from '@/exists';
import remove from '@/remove';
import read from '@/read';
import write from '@/write';
import move from '.';

describe('@/move/file', () => {
  const sourceFile = 'testMoveFileSource.txt';
  const targetFile = 'testMoveFileTarget.txt';
  const testContent = '测试移动内容';

  beforeEach(async () => {
    // 创建源文件
    await write(sourceFile, testContent);
  });

  afterEach(async () => {
    await remove([sourceFile, targetFile, 'testTargetDir']);
  });

  it('成功移动文件', async () => {
    const result = await move(sourceFile, targetFile);
    expect(result).toBe(true);
    const content = await read(targetFile);
    expect(content).toBe(testContent);
    const sourceExists = await exists(sourceFile);
    expect(sourceExists).toBe(false);
  });

  it('移动到已存在的文件，而且不覆盖的情况下，应该返回 false', async () => {
    await write(targetFile, '已存在的内容');
    expect(await move(sourceFile, targetFile, false)).toBeFalsy();
  });

  it('移动到已存在的文件，开启覆盖后，应该成功', async () => {
    await write(targetFile, '已存在的内容');
    expect(await move(sourceFile, targetFile, true)).toBe(true);
  });

  it('源文件不存在时应，应该返回 false', async () => {
    const nonExistingFile = 'nonExistingFile.txt';
    expect(await move(nonExistingFile, targetFile, false)).toBeFalsy();
  });

  it('目标路径不是文件时，应该返回 false', async () => {
    const targetDir = 'testTargetDir';
    expect(await move(sourceFile, targetDir, false)).toBeFalsy();
  });
});
