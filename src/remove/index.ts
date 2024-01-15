import fs from 'fs/promises';
import Path from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 删除指定的文件或目录 (delete the specified file or directory)
 * @param {string} itemPath 文件或目录路径 (the path of the file or directory)
 * @param {boolean} includeSubDirs 是否包含子目录 (whether to include subdirectories)
 */
const deleteItem = async (itemPath: string, includeSubDirs: boolean): Promise<void> => {
  const stack = [itemPath];

  while (stack.length > 0) {
    const currentPath = stack[stack.length - 1];
    const stat = await fs.stat(currentPath);

    if (stat.isDirectory()) {
      const files = await fs.readdir(currentPath);

      if (files.length > 0) {
        if (includeSubDirs) {
          // 将子目录和文件添加到栈中
          files.forEach((file) => stack.push(Path.join(currentPath, file)));
        } else {
          // 不包含子目录，跳过非空目录
          stack.pop();
        }
      } else {
        // 删除空目录并从栈中移除
        await fs.rmdir(currentPath);
        stack.pop();
      }
    } else {
      // 删除文件并从栈中移除
      await fs.unlink(currentPath);
      stack.pop();
    }
  }
};

/**
 * 删除指定路径的文件或目录 (delete the specified path of the file or directory)
 * @param {string | string[]} paths 要删除的文件或目录路径 (the path of the file or directory to delete)
 * @param {boolean} [includeSubDirs=true] 是否包含子目录 (whether to include subdirectories)
 * @returns {Promise<boolean>} 是否删除成功 (whether the deletion is successful)
 */
const remove = async (paths: string | string[], includeSubDirs: boolean = true): Promise<boolean> => {
  try {
    const normalizedPaths = Array.isArray(paths) ? paths.map(normalize) : [normalize(paths)];
    for (const path of normalizedPaths) {
      if (await exists(path)) {
        await deleteItem(path, includeSubDirs);
      }
    }

    return true;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    return false;
  }
};

export default remove;
