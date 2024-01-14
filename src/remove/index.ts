import fs from 'fs/promises';
import { join } from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 删除指定的文件或目录 (delete the specified file or directory)
 * @param {string} itemPath 文件或目录路径 (the path of the file or directory)
 * @param {boolean} includeSubDirs 是否包含子目录 (whether to include subdirectories)
 */
const deleteItem = async (itemPath: string, includeSubDirs: boolean): Promise<void> => {
  const stat = await fs.stat(itemPath);

  if (stat.isDirectory()) {
    const files = await fs.readdir(itemPath);

    if (files.length && includeSubDirs) {
      // 处理所有子目录和文件
      for (const file of files) {
        const curPath = join(itemPath, file);
        await deleteItem(curPath, includeSubDirs);
      }
    }

    // 检查目录是否为空，若为空则删除
    const updatedFiles = await fs.readdir(itemPath);
    if (updatedFiles.length === 0) {
      await fs.rmdir(itemPath);
    }
  } else {
    await fs.unlink(itemPath);
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
