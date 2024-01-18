import { readdir, stat } from 'fs/promises';
import { TFileSize } from './interface';
import { join } from 'path';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 获取指定路径的文件或目录大小 (Get the size of the specified path of the file or directory)
 * @param {string} path 文件或目录路径 (the path of the file or directory)
 * @returns {Promise<bigint>} 文件或目录大小 (the size of the file or directory)
 */
const getSize = async (path: string): Promise<bigint> => {
  const stack = [path];
  if (await exists(path)) {
    let totalSize: bigint = BigInt(0);

    while (stack.length > 0) {
      const currentPath = stack.pop();
      const stats = await stat(currentPath!, { bigint: true });

      if (stats.isDirectory()) {
        const files = await readdir(currentPath!);
        for (const file of files) {
          stack.push(join(currentPath!, file));
        }
      } else {
        totalSize += BigInt(stats.size);
      }
    }

    return totalSize;
  } else {
    return BigInt(0);
  }
};

/**
 * 获取指定路径的文件或目录大小 (Get the size of the specified path of the file or directory)
 * @param {string | string[]} paths 文件或目录路径 (the path of the file or directory)
 * @param {boolean} [useBigInt=false] 是否使用 bigint 类型 (whether to use bigint type)
 * @returns {Promise<TFileSize[]>} 文件或目录大小 (the size of the file or directory)
 */
const size = async (paths: string | string[], useBigInt: boolean = false): Promise<TFileSize[]> => {
  const sizes: TFileSize[] = [];
  const normalizedPaths = Array.isArray(paths) ? paths.map(normalize) : [normalize(paths)];

  for (const path of normalizedPaths) {
    const calculatedSize = await getSize(path);
    const size = useBigInt ? calculatedSize : calculatedSize <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(calculatedSize) : calculatedSize;
    sizes.push({ path, size });
  }

  return sizes;
};

export default size;
