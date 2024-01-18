import remove from '@/remove';
import copy from '@/copy/file';

/**
 * 移动文件到新位置
 * @param {string} source 源文件路径
 * @param {string} target 目标文件路径
 * @param {boolean} [overwrite=true] 是否覆盖已存在的文件 (whether to overwrite existing files)
 * @returns {Promise<boolean>} 是否移动成功
 */
const file = async (source: string, target: string, overwrite: boolean = true): Promise<boolean> => {
  if (await copy(source, target, overwrite)) {
    return await remove(source);
  }

  return false;
};

export default file;
