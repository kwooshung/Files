import fs from 'fs/promises';
import { join } from 'path';
import remove from '@/remove';
import normalize from '@/normalize';

/**
 * 删除指定的单个目录中，所有空目录 (delete all empty folders in the specified single folder)
 * @param {string} path 根目录路径 (root directory path)
 * @param {Set<string>} checkedDirs 已检查过的目录 (checked directories)
 * @returns {Promise<boolean>} 是否成功删除所有空目录 (whether all empty folders are successfully deleted)
 */
const emptyDir = async (path: string, checkedDirs: Set<string>): Promise<void> => {
  const items = await fs.readdir(path, { withFileTypes: true });
  if (items.length === 0) {
    await remove(path);
    return;
  }

  for (const item of items) {
    if (item.isDirectory()) {
      const subDirPath = join(path, item.name);
      if (!checkedDirs.has(subDirPath)) {
        checkedDirs.add(subDirPath);
        await emptyDir(subDirPath, checkedDirs);
      }
    }
  }

  // 再次检查当前目录是否为空，因为子目录可能已被删除
  const updatedItems = await fs.readdir(path);
  if (updatedItems.length === 0) {
    await remove(path);
  }
};

/**
 * 删除所有空目录 （delete all empty folders）
 * @description 该方法会递归地删除所有空目录，包含指定的目录本身；在现代的计算机上，递归处理几百上千层目录虽然没问题，但是更建议目录深度控制在20层以内；如果指定的目录不存在，该方法会抛出异常 (This method will recursively delete all empty folders, including the specified directory itself; on modern computers, recursive processing of hundreds or thousands of layers of folders is no problem, but it is more recommended that the folder depth be controlled within 20 layers; if the specified directory does not exist, this method will throw an exception)
 * @param {string | string[]} paths 根目录路径 (root directory path)
 * @returns {Promise<boolean>} 是否成功删除所有空目录 (whether all empty folders are successfully deleted)
 */
const emptyDirs = async (paths: string | string[]): Promise<boolean> => {
  let result = true;
  const normalizedPaths = Array.isArray(paths) ? paths.map(normalize) : [normalize(paths)];
  const checkedDirs = new Set<string>();

  try {
    for (const path of normalizedPaths) {
      await emptyDir(path, checkedDirs);
    }
  } catch (err) {
    result = false;
    throw err;
  }

  return result;
};

export default emptyDirs;
