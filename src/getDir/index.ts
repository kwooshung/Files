import fs from 'fs/promises';
import path from 'path';

/**
 * 过滤类型 (filter type)
 */
type TFilterType = 'all' | 'file' | 'dir';

/**
 * 获取目录下的所有文件或目录 (Get all files or directories under the directory)
 * @param {string} dirPath 目录路径 (directory path)
 * @param {boolean} [includeSubDirs = false] 是否包含子目录 (Whether to include subdirectories)
 * @param {TFilterType} [filter = 'all'] 过滤类型 (filter type)
 * @returns {Promise<string[]>} 文件或目录路径数组 (File or directory path array)
 */
const getDir = async (dirPath: string, includeSubDirs: boolean = false, filter: TFilterType = 'all'): Promise<string[]> => {
  const results: string[] = [];
  const stack: string[] = [dirPath];

  while (stack.length > 0) {
    const currentPath = stack.pop()!;

    try {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);

        if (item.isDirectory()) {
          if (filter === 'dir' || filter === 'all') {
            results.push(fullPath);
          }
          if (includeSubDirs) {
            stack.push(fullPath);
          }
        } else if (item.isFile() && (filter === 'file' || filter === 'all')) {
          results.push(fullPath);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      return [];
    }
  }

  return results;
};

export default getDir;
