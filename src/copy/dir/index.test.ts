import { join } from 'path';
import write from '@/write';
import exists from '@/exists';
import remove from '@/remove';
import makeDir from '@/makeDir';
import copy from '.';

// 测试所需的临时目录和文件
const testDirPath = 'testCopyDir';
const srcDirPath = join(testDirPath, 'source');
const destDirPath = join(testDirPath, 'destination');
const testFilePath = join(srcDirPath, 'testFile.txt');

describe('@/copy/dir', () => {
  // 创建测试环境
  beforeAll(async () => {
    await makeDir(testDirPath);
    await makeDir(srcDirPath);
    await write(testFilePath, '这是一些测试内容');
  });

  // 清理测试环境
  afterAll(async () => {
    await remove(testDirPath);
  });

  it('复制非空目录到新位置', async () => {
    const result = await copy(srcDirPath, destDirPath);
    expect(result).toBeTruthy();
    const fileExists = await exists(join(destDirPath, 'testFile.txt'));
    expect(fileExists).toBeTruthy();
  });

  it('复制空目录到新位置', async () => {
    const emptySrcDirPath = join(testDirPath, 'emptySource');
    const emptyDestDirPath = join(testDirPath, 'emptyDestination');
    await makeDir(emptySrcDirPath);

    const result = await copy(emptySrcDirPath, emptyDestDirPath, false);
    expect(result).toBeTruthy();
    const dirExists = await exists(emptyDestDirPath);
    expect(dirExists).toBeTruthy();
  });

  it('当源目录不存在时应抛出错误', async () => {
    const nonExistingSrcDirPath = join(testDirPath, 'nonExistingSource');
    let error = null;
    try {
      await copy(nonExistingSrcDirPath, destDirPath, false);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('当目标目录已存在且设置覆盖时，应成功复制', async () => {
    const result = await copy(srcDirPath, destDirPath);
    expect(result).toBeTruthy();
  });

  it('当源路径不是目录时应抛出错误', async () => {
    let error = null;
    try {
      await copy(testFilePath, destDirPath, false);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
  });

  it('当目标路径不是目录时应抛出错误', async () => {
    let error = null;
    const nonDirTargetPath = join(testDirPath, 'testFile.txt');
    await write(nonDirTargetPath, '占位文件');
    try {
      await copy(srcDirPath, nonDirTargetPath, false);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
  });

  it('复制包含多级子目录和文件的目录', async () => {
    const multiLevelSrcDir = join(srcDirPath, 'level1', 'level2');
    const multiLevelDestDir = join(destDirPath, 'level1', 'level2');
    await makeDir(multiLevelSrcDir);
    const testFileInMultiLevelDir = join(multiLevelSrcDir, 'test.txt');
    await write(testFileInMultiLevelDir, '多级目录测试');
    const result = await copy(srcDirPath, destDirPath);
    expect(result).toBeTruthy();
    const fileExistsInDest = await exists(join(multiLevelDestDir, 'test.txt'));
    expect(fileExistsInDest).toBeTruthy();
  });
});
