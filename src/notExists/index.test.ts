import write from '@/write';
import remove from '@/remove';
import makeDir from '@/makeDir';
import notExists from '.';

describe('@/notExists', () => {
  it('检查文件是否不存在', async () => {
    expect(await notExists('zhegekendingbucunzai')).toBeTruthy();
  });

  it('检查文件夹是否不存在', async () => {
    const testDir = 'testExistsDir';
    await makeDir(testDir);

    const existsResult = await notExists(testDir);
    await remove(testDir);

    expect(existsResult).toBeFalsy();
  });

  it('检查多个路径是否不存在', async () => {
    const testFile1 = 'testExists1.txt';
    const testFile2 = 'testExists2.txt';
    await write(testFile1, '测试内容');
    await write(testFile2, '测试内容');

    const existsResult = await notExists([testFile1, testFile2]);
    await remove(testFile1);
    await remove(testFile2);

    expect(existsResult).toBeFalsy();
  });
});
