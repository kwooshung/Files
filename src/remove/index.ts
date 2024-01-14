import fs from 'fs/promises';
import { join } from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 删除指定路径的文件或目录 (delete the file or directory of the specified path)
 * @param {string | string[]} paths 要删除的文件或目录路径 (the file or directory path to delete)
 * @param {boolean} [includeSubDirs=true] 是否包含子目录 (whether to include subdirectories)
 * @param {number} [concurrency=5] 并发数 (concurrency)
 * @returns {Promise<boolean>} 是否删除成功 (whether the deletion is successful)
 */
const remove = async (paths: string | string[], includeSubDirs: boolean = true, concurrency: number = 5): Promise<boolean> => {
  try {
    const normalizedPaths = Array.isArray(paths) ? paths.map(normalize) : [normalize(paths)];

    for (const path of normalizedPaths) {
      if (await exists(path)) {
        const deleteQueue: Promise<void>[] = [];
        const stack: { path: string; parent: string | null }[] = [{ path, parent: null }];

        while (stack.length) {
          if (deleteQueue.length >= concurrency) {
            await Promise.all(deleteQueue.splice(0, deleteQueue.length));
          }

          const { path: currentPath, parent } = stack.pop() || {};

          if (currentPath) {
            const stat = await fs.stat(currentPath);

            if (stat.isDirectory()) {
              const files = await fs.readdir(currentPath);

              if (files.length) {
                files.forEach((file) => {
                  const curPath = join(currentPath, file);
                  stack.push({ path: curPath, parent: currentPath });
                });
              } else {
                if (includeSubDirs || parent) {
                  deleteQueue.push(fs.rmdir(currentPath));
                }
              }
            } else {
              deleteQueue.push(fs.unlink(currentPath));
            }
          }
        }

        // 确保所有挂起的删除操作都完成
        await Promise.all(deleteQueue);
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
