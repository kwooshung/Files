import write from '@/write';
import remove from '@/remove';
import makeDir from '@/makeDir';
import exists from '.';

describe('@/exists', () => {
  it('检查文件是否存在', async () => {
    const testFile = 'testExists.txt';
    await write(testFile, '测试内容');

    const existsResult = await exists(testFile);
    await remove(testFile);

    expect(existsResult).toBeTruthy();
  });

  it('检查文件夹是否存在', async () => {
    const testDir = 'testExistsDir';
    await makeDir(testDir);

    const existsResult = await exists(testDir);
    await remove(testDir);

    expect(existsResult).toBeTruthy();
  });

  it('检查多个路径是否存在', async () => {
    const testFile1 = 'testExists1.txt';
    const testFile2 = 'testExists2.txt';
    await write(testFile1, '测试内容');
    await write(testFile2, '测试内容');

    const existsResult = await exists([testFile1, testFile2]);
    await remove(testFile1);
    await remove(testFile2);

    expect(existsResult).toBeTruthy();
  });
});
