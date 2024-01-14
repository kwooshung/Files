import remove from '@/remove';
import copy from '@/copy/dir';

/**
 * 移动文件到新位置
 * @param {string} source 源文件路径
 * @param {string} target 目标文件路径
 * @param {boolean} [overwrite=false] 是否覆盖已存在的文件 (whether to overwrite existing files)
 * @returns {Promise<boolean>} 是否移动成功
 */
const dir = async (source: string, target: string, overwrite: boolean = false): Promise<boolean> => {
  try {
    if (await copy(source, target, overwrite)) {
      return await remove(source);
    }

    return false;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    return false;
  }
};

export default dir;
