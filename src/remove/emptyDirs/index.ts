import fs from 'fs/promises';
import path from 'path';
import remove from '@/remove';

/**
 * 删除所有空文件夹
 * @param {string} dirPath 根目录路径
 * @returns {Promise<boolean>} 是否成功删除所有空文件夹
 */
const emptyDirs = async (dirPath: string): Promise<boolean> => {
  const stack: string[] = [];
  const emptyFolders: string[] = [];

  stack.push(dirPath);

  while (stack.length > 0) {
    const currentPath = stack.pop()!;
    try {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      if (items.length === 0) {
        // 目录为空，记录以便稍后删除
        emptyFolders.push(currentPath);
      } else {
        for (const item of items) {
          if (item.isDirectory()) {
            stack.push(path.join(currentPath, item.name));
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      return false;
    }
  }

  let result: boolean = true;
  // 从最深层的目录开始删除空文件夹
  for (const folder of emptyFolders.reverse()) {
    try {
      if (!(await remove(folder))) {
        result = false;
        break;
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      return false;
    }
  }

  return result;
};

export default emptyDirs;
