import fs from 'fs/promises';
import { extname, dirname } from 'path';
import normalize from '@/normalize';

/**
 * 创建指定路径的文件夹，支持创建多级文件夹 (create the specified path of the folder, support to create multi-level folders)
 * @description 如果存在这个路径，则不会创建，如果不存在，则会创建；如果是文件路径，则取其父目录 (if this path exists, it will not be created, if it does not exist, it will be created; if it is a file path, then take its parent directory)
 * @param {string} dir 要创建的文件夹路径，如果是文件路径，则取其所在目录 (the path of the folder to create, if it is a file path, then take its parent directory)
 * @returns {Promise<boolean>} 如果创建成功或已存在，则返回 true；否则返回 false (if the creation is successful or exists, return true; otherwise return false)
 */
const createDir = async (dir: string): Promise<boolean> => {
  try {
    dir = normalize(dir);

    // 判断是否是文件路径
    const isFilePath = extname(dir) !== '';

    // 获取目录所在的目录路径，如果是文件路径，则取其父目录，否则默认为当前目录
    await fs.mkdir(isFilePath ? dirname(dir) : dir, { recursive: true });

    return true;
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    // 如果错误代码表示目录已存在，则返回 true
    if (error.code === 'EEXIST') {
      return true;
    } else if (err instanceof Error) {
      throw err;
    }

    return false;
  }
};

/**
 * 创建指定路径的文件夹，支持创建多级文件夹，可以传入多个路径 (create the specified path of the folder, support to create multi-level folders, you can pass in multiple paths)
 * @description 如果存在这个路径，则不会创建，如果不存在，则会创建；如果是文件路径，则取其父目录 (if this path exists, it will not be created, if it does not exist, it will be created; if it is a file path, then take its parent directory)
 * @param {string | string[]} dirs 要创建的文件夹路径，如果是文件路径，则取其所在目录 (the path of the folder to create, if it is a file path, then take its parent directory)
 * @returns {Promise<boolean>} 如果创建成功或已存在，则返回 true；否则返回 false (if the creation is successful or exists, return true; otherwise return false)
 */
const makeDir = async (dirs: string | string[]): Promise<boolean> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const normalizedPaths = Array.isArray(dirs) ? dirs.map(normalize) : [normalize(dirs)];
    for (const path of normalizedPaths) {
      const result = await createDir(path);
      if (!result) {
        return false;
      }
    }

    return true;
  } catch (err) {
    throw err;
  }
};

export default makeDir;
