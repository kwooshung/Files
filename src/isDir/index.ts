import fs from 'fs/promises';
import normalize from '@/normalize';

/**
 * 检查路径是否为目录。
 * @param {string} path 要检查的路径。
 * @returns {Promise<boolean>} 如果路径是目录，则返回 true，否则返回 false。
 */
const isDir = async (path: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(normalize(path));
    return stats.isDirectory();
  } catch (err) {
    // 错误处理：如果路径不存在或无法访问，将被视为非目录
    return false;
  }
};

export default isDir;
