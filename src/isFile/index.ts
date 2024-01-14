import fs from 'fs/promises';
import normalize from '@/normalize';

/**
 * 检查路径是否为文件。
 * @param {string} path 要检查的路径。
 * @returns {Promise<boolean>} 如果路径是文件，则返回 true，否则返回 false。
 */
const isFile = async (path: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(normalize(path));
    return stats.isFile();
  } catch (err) {
    // 错误处理：如果路径不存在或无法访问，将被视为非文件
    return false;
  }
};

export default isFile;
