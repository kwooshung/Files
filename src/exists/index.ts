import fs from 'fs/promises';
import normalize from '../normalize';

/**
 * 检查单个路径是否存在 (check if a single path exists)
 * @param {string} path 要检查的路径 (the path to check)
 * @returns {Promise<boolean>} 路径存在则返回 `true`，否则返回 `false` (returns `true` if the path exists, otherwise returns `false`)。
 */
const checkPathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 检查文件或文件夹路径是否存在 (check if a file or folder path exists)
 * @param {string | string[]} paths 要检查的路径，可以是单个路径字符串或路径字符串数组 (the path to check, can be a single path string or path string array)
 * @returns {Promise<boolean>} 如果所有路径存在，则返回 `true`，否则返回 `false` (returns `true` if all paths exist, otherwise returns `false`)
 */
const exists = async (paths: string | string[]): Promise<boolean> => {
  const normalizedPaths = Array.isArray(paths) ? paths.map((p) => normalize(p)) : [normalize(paths)];
  const results = await Promise.all(normalizedPaths.map(checkPathExists));
  return results.every((result) => result);
};

export default exists;
