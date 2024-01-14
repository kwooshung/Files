import fs from 'fs/promises';
import normalize from '@/normalize';
import exists from '@/exists';

/**
 * 读取指定路径的文件内容 (read the contents of the specified path file)
 * @param {string} filePath 要读取的文件路径 (the file path to read)
 * @param {BufferEncoding} [encoding='utf8'] 文件的编码格式，默认为 utf8 (the encoding format of the file, default is utf8)
 * @returns {Promise<string>} 返回文件内容。
 */
const read = async (filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> => {
  try {
    if (await exists(filePath)) {
      return await fs.readFile(normalize(filePath), encoding);
    }
    return '';
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'ENOENT') {
      return ''; // 文件不存在，返回空字符串
    } else if (err instanceof Error) {
      throw err;
    }

    return '';
  }
};

export default read;
