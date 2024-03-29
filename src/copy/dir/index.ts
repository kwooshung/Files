import fs from 'fs/promises';
import { join } from 'path';
import isDir from '@/isDir';
import normalize from '@/normalize';
import makeDir from '@/makeDir';
import notExists from '@/exists/not';
import copy from '@/copy/file';

/**
 * 复制目录到新位置 (copy the directory to a new location)
 * @param {string} source 源目录路径 (source directory path)
 * @param {string} target 目标目录路径 (target directory path)
 * @param {boolean} [overwrite=true] 是否覆盖已存在的文件 (whether to overwrite existing files)
 * @returns {Promise<boolean>} 是否复制成功 (whether the copy was successful)
 */
const dir = async (source: string, target: string, overwrite: boolean = true): Promise<boolean> => {
  try {
    if (!(await isDir(source))) {
      throw new Error('The source path is not a directory.');
    } else if (!(await isDir(target))) {
      if (await notExists(target)) {
        await makeDir(target);
      }
    }

    const normalizedSource = normalize(source);
    const normalizedTarget = normalize(target);

    const queue = [{ source: normalizedSource, target: normalizedTarget }];
    while (queue.length > 0) {
      const task = queue.shift();

      if (task) {
        const { source: currentSource, target: currentTarget } = task;

        const items = await fs.readdir(currentSource, { withFileTypes: true });
        for (const item of items) {
          const sourcePath = join(currentSource, item.name);
          const targetPath = join(currentTarget, item.name);

          if (item.isDirectory()) {
            (await makeDir(targetPath)) && queue.push({ source: sourcePath, target: targetPath });
          } else {
            await copy(sourcePath, targetPath, overwrite);
          }
        }
      }
    }

    return true;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
};

export default dir;
