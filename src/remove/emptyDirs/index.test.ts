import { join } from 'path';
import exists from '@/exists';
import notExists from '@/exists/not';
import remove from '@/remove';
import makeDir from '@/makeDir';
import write from '@/write';
import removeEmptyDirs from '.';

describe('@/remove/emptyDirs', () => {
  const testDirBase = 'test-removeEmptyDirs';
  const createNestedDirStructure = async () => {
    await makeDir(join(testDirBase, 'emptyDir'));
    await makeDir(join(testDirBase, 'notEmptyDir'));
    await makeDir(join(testDirBase, 'nestedDir', 'emptyNestedDir'));
    await write(join(testDirBase, 'notEmptyDir', 'file.txt'), 'Test content');
  };

  beforeAll(async () => {
    await makeDir(testDirBase);
    await createNestedDirStructure();
  });

  afterAll(async () => {
    await remove(testDirBase);
  });

  it('尝试删除不存在的目录', async () => {
    const nonExistingPath = join(testDirBase, 'nonExisting');
    await expect(removeEmptyDirs(nonExistingPath)).rejects.toThrow();
  });

  it('应该删除所有空目录', async () => {
    const result = await removeEmptyDirs(testDirBase);
    expect(result).toBeTruthy();
  });

  it('成功查找到空目录，空目录删除后，根目录也空了，那么就会删除根目录', async () => {
    await makeDir([join(testDirBase, 'empty1'), join(testDirBase, 'empty2'), join(testDirBase, 'empty3'), join(testDirBase, 'empty4')]);

    expect(await remove(join(testDirBase, 'notEmptyDir/file.txt'))).toBeTruthy();
    expect(await removeEmptyDirs(testDirBase)).toBeTruthy();
    expect(await notExists(testDirBase)).toBeTruthy();
  });

  it('成功查找到多个空目录，并删除', async () => {
    await makeDir([join(testDirBase, 'empty1', 'a'), join(testDirBase, 'empty2', 'b'), join(testDirBase, 'empty3', 'c'), join(testDirBase, 'empty4', 'd')]);

    expect(await remove(join(testDirBase, 'notEmptyDir/file.txt'))).toBeTruthy();
    expect(await removeEmptyDirs(testDirBase)).toBeTruthy();
    expect(await notExists(testDirBase)).toBeTruthy();
  });

  it('删除多层嵌套的空目录，只要有文件就不删除', async () => {
    await makeDir([
      join(testDirBase, 'nested1', 'nested2', 'nested3'),
      join(testDirBase, 'nested1', 'nested2', 'nonempty'),
      join(testDirBase, 'nested1', 'nested2', 'nonempty', 'aaa.txt'),
      join(testDirBase, 'nested1', 'nested2', 'nonempty', 'bbb.txt')
    ]);
    await write(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'abc.txt'), 'Test content');
    await write(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'bbb-txt', 'abc.txt'), 'Test content');

    expect(await remove(join(testDirBase, 'notEmptyDir/file.txt'))).toBeTruthy();
    expect(await removeEmptyDirs(testDirBase)).toBeTruthy();

    expect(await notExists(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'aaa.txt'))).toBeTruthy(); // 删除了aaa.txt
    expect(await notExists(join(testDirBase, 'emptyDir'))).toBeTruthy();
    expect(await notExists(join(testDirBase, 'nestedDir', 'emptyNestedDir'))).toBeTruthy();

    expect(await exists(testDirBase)).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1', 'nested2'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1', 'nested2', 'nonempty'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'abc.txt'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'bbb-txt'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'nested1', 'nested2', 'nonempty', 'bbb-txt', 'abc.txt'))).toBeTruthy();
  });

  it('删除，多个路径，多层嵌套的空目录，只要有文件就不删除', async () => {
    await makeDir([join(testDirBase, 'a', '1', '5'), join(testDirBase, 'b', '2', '6'), join(testDirBase, 'c', '3', '7'), join(testDirBase, 'd', '4', '8')]);

    await write(join(testDirBase, 'c', '3', 'abc.txt'), 'Test content');

    expect(await remove(join(testDirBase, 'notEmptyDir/file.txt'))).toBeTruthy();
    expect(await removeEmptyDirs([join(testDirBase, 'a'), join(testDirBase, 'b'), join(testDirBase, 'c'), join(testDirBase, 'd')])).toBeTruthy();

    expect(await exists(testDirBase)).toBeTruthy();
    expect(await exists(join(testDirBase, 'c'))).toBeTruthy();
    expect(await exists(join(testDirBase, 'c', '3'))).toBeTruthy();

    expect(await notExists(join(testDirBase, 'a'))).toBeTruthy();
    expect(await notExists(join(testDirBase, 'b'))).toBeTruthy();
    expect(await notExists(join(testDirBase, 'c', '3', '7'))).toBeTruthy();
    expect(await notExists(join(testDirBase, 'd'))).toBeTruthy();
  });

  it('不应删除包含文件的目录', async () => {
    const notEmptyDirExists = await remove(join(testDirBase, 'notEmptyDir'));
    expect(notEmptyDirExists).toBeTruthy();
  });

  it('尝试删除文件而不是目录', async () => {
    const filePath = join(testDirBase, 'file.txt');
    await write(filePath, 'Test content');
    await expect(removeEmptyDirs(filePath)).rejects.toThrow();
  });

  it('应该删除嵌套的空目录', async () => {
    const nestedEmptyDirExists = await remove(join(testDirBase, 'nestedDir/emptyNestedDir'));
    expect(nestedEmptyDirExists).toBeTruthy();
  });

  it('在传递不存在的目录时，应该抛出异常', async () => {
    let err: Error;

    try {
      await removeEmptyDirs('nonExistingDir');
    } catch (e) {
      err = e;
    }

    expect(err['code']).toBe('ENOENT');
  });
});
