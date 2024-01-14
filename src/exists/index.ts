import fs from 'fs/promises';
import normalize from '@/normalize';

/**
 * 检查单个路径是否存在 (check if a single path exists)
 * @param {string} path 要检查的路径 (the path to check)
 * @returns {Promise<boolean>} 路径存在则返回 `true`，否则返回 `false` (returns `true` if the path exists, otherwise returns `false`)。
 */
const checkPathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 检查文件或文件夹路径是否存在 (check if a file or folder path exists)
 * @param {string | string[]} paths 要检查的路径，可以是单个路径字符串或路径字符串数组 (the path to check, can be a single path string or path string array)
 * @param {boolean} [anyExists=false] 是否只要有一个路径存在就返回 `true` (whether to return `true` if only one path exists)
 * @returns {Promise<boolean>} 路径是否存在 (whether the path exists)
 */
const exists = async (paths: string | string[], anyExists: boolean = false): Promise<boolean> => {
  const normalizedPaths = Array.isArray(paths) ? paths.map((p) => normalize(p)) : [normalize(paths)];
  const results = await Promise.all(normalizedPaths.map(checkPathExists));

  return anyExists ? results.some((result) => result) : results.every((result) => result);
};

export default exists;
