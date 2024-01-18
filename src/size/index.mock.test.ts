import { join } from 'path';
import makeDir from '@/makeDir';
import write from '@/write';
import remove from '@/remove';

describe('@/size.mock', () => {
  const testDir = 'test-size';
  const testFile = join(testDir, 'test.txt');
  const testSubDir = join(testDir, 'subdir');
  const testSubFile = join(testSubDir, 'subfile.txt');

  beforeAll(async () => {
    await makeDir(testDir);
    await write(testFile, 'Hello World');
    await makeDir(testSubDir);
    await write(testSubFile, 'Another file');
  });

  afterAll(async () => {
    await remove(testDir);
  });

  it('处理大于Number.MAX_SAFE_INTEGER的文件大小', async () => {
    const testFileSize = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);

    jest.doMock('fs/promises', () => ({
      ...jest.requireActual('fs/promises'),
      stat: () =>
        Promise.resolve({
          isDirectory: () => false,
          size: testFileSize
        })
    }));

    const size = require('.').default;

    const results = await size(testFile);
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe(testFile);
    expect(results[0].size).toBe(testFileSize);

    jest.resetModules();
    jest.unmock('fs/promises');
  });
});
