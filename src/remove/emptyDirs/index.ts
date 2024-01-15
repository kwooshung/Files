import fs from 'fs/promises';
import Path from 'path';
import remove from '@/remove';
import normalize from '@/normalize';

/**
 * 删除指定的单个文件夹中，所有空文件夹 (delete all empty folders in the specified single folder)
 * @param {string} path 根目录路径 (root directory path)
 * @returns {Promise<boolean>} 是否成功删除所有空文件夹 (whether all empty folders are successfully deleted)
 */
const emptyDir = async (path: string): Promise<boolean> => {
  let result = true;
  const stack: string[] = [path];
  const toDelete: string[] = [];

  while (stack.length > 0) {
    const currentPath = stack.pop()!;
    const items = await fs.readdir(currentPath, { withFileTypes: true });

    if (items.length === 0) {
      toDelete.push(currentPath);
    } else {
      for (const item of items) {
        if (item.isDirectory()) {
          stack.push(Path.join(currentPath, item.name));
        }
      }
    }
  }

  // 对待删除目录进行排序，保证子目录在父目录之前被删除
  toDelete.sort().reverse();

  for (const folder of toDelete) {
    await remove(folder);
    const parentFolder = Path.dirname(folder);
    if (!toDelete.includes(parentFolder)) {
      const parentItems = await fs.readdir(parentFolder);
      if (parentItems.length === 0) {
        // 如果父目录为空，则也删除
        if (!(await remove(parentFolder))) {
          result = false;
        }
      }
    }
  }

  return result;
};

/**
 * 删除所有空文件夹 （delete all empty folders）
 * @param {string | string[]} paths 根目录路径 (root directory path)
 * @returns {Promise<boolean>} 是否成功删除所有空文件夹 (whether all empty folders are successfully deleted)
 */
const emptyDirs = async (paths: string | string[]): Promise<boolean> => {
  let result = true;
  const normalizedPaths = Array.isArray(paths) ? paths.map(normalize) : [normalize(paths)];
  for (const path of normalizedPaths) {
    if (!(await emptyDir(path))) {
      result = false;
    }
  }

  return result;
};

export default emptyDirs;
