import fs from 'fs/promises';
import { join } from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

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
