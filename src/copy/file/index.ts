import fs from 'fs/promises';
import normalize from '@/normalize';
import makeDir from '@/makeDir';

/**
 * 复制文件到新位置 (copy the file to a new location)
 * @param {string} source 源文件路径 (source file path)
 * @param {string} target 目标文件路径 (target file path)
 * @param {boolean} [overwrite=true] 是否覆盖已存在的文件 (whether to overwrite existing files)
 * @returns {Promise<boolean>} 是否复制成功 (whether the copy was successful)
 */
const file = async (source: string, target: string, overwrite: boolean = true): Promise<boolean> => {
  try {
    const normalizedSource = normalize(source);
    const normalizedTarget = normalize(target);

    // 检查源文件和目标文件是否相同
    if (normalizedSource && normalizedTarget && normalizedSource !== normalizedTarget) {
      await makeDir(normalizedTarget);
      await fs.copyFile(normalizedSource, normalizedTarget, overwrite ? 0 : fs.constants.COPYFILE_EXCL);
    }

    return true;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    return false;
  }
};

export default file;
