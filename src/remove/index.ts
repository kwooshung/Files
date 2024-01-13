import fs from 'fs/promises';
import { join } from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 删除文件或文件夹 (remove file or folder)
 * @param {string | string[]} paths 要删除的文件或文件夹路径 (the path of the file or folder to be deleted)
 * @param {boolean} [includeSubDirs = true] 是否包含子文件夹 (whether to include subfolders)
 * @param {number} [concurrency = 5] 并发删除文件的数量 (the number of concurrent deletions)
 * @returns {Promise<boolean>} 如果删除成功，则返回 true; 否则返回错误对象 (returns `true` if the deletion is successful, otherwise returns an error object)
 */
const remove = async (paths: string | string[], includeSubDirs: boolean = true, concurrency: number = 5): Promise<boolean> => {
  try {
    const normalizedPaths = Array.isArray(paths) ? paths.map((path: string) => normalize(path)) : [normalize(paths)];

    for (const path of normalizedPaths) {
      const normalizedDir = normalize(path);
      if (await exists(normalizedDir)) {
        const deleteQueue: Promise<void>[] = [];
        const stack: { path: string; parent: string | null }[] = [{ path: normalizedDir, parent: null }];

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
                if (parent || includeSubDirs) {
                  deleteQueue.push(fs.rmdir(currentPath));
                }
              }
            } else {
              deleteQueue.push(fs.unlink(currentPath));
            }
          }
        }

        if (deleteQueue.length) {
          await Promise.all(deleteQueue);
        }
      }
    }

    return true;
  } catch (err) {
    console.error(`An error occurred during the remove operation: ${err}`);
    return false;
  }
};

export default remove;
