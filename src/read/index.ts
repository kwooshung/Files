import fs from 'fs/promises';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 读取指定路径的文件内容。
 * @param {string} filePath 要读取的文件路径。
 * @param {BufferEncoding} [encoding='utf8'] 文件的编码格式，默认为 utf8。
 * @returns {Promise<string>} 返回文件内容。
 */
const read = async (filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> => {
  try {
    if (await exists(filePath)) {
      return await fs.readFile(normalize(filePath), encoding);
    }
  } catch (err) {
    console.error(`An error occurred during the read operation: ${err}`);
    return '';
  }
};

export default read;
