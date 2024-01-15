import fs from 'fs/promises';
import Path from 'path';
import normalize from '@/normalize';
import notExists from '@/notExists';
import makeDir from '@/makeDir';

/**
 * 抛出错误 (throw error)
 */
const throwErr = () => {
  throw new Error('The file already exists and does not overwrite or append, so it cannot be written.');
};

/**
 * 将内容写入指定的文件 (write content to the specified file)
 * @param {string} filePath 文件路径 (file path)
 * @param {string} content 要写入的内容 (content to write)
 * @param {boolean} [append = false] 是否追加 (whether to append)
 * @param {boolean} [overwriteIfExists = true] 如果文件已存在，是否覆盖 (if the file already exists, whether to overwrite)
 * @param {BufferEncoding} [encoding='utf8'] 文件的编码格式，默认为 utf8 (the encoding format of the file, default is utf8)
 * @returns {Promise<boolean>} 如果写入成功，则返回 true；否则返回 false (if the write is successful, `true` is returned; otherwise `false` is returned)
 */
const write = async (filePath: string, content: string, append: boolean = false, overwriteIfExists: boolean = true, encoding: BufferEncoding = 'utf8'): Promise<boolean> => {
  try {
    const absPath = normalize(filePath);

    // 获取目标文件夹路径
    const dirPath = Path.dirname(absPath);

    // 创建目标文件夹，支持多层文件夹
    await makeDir(dirPath);

    // 如果文件不存在，或者允许覆盖，则直接写入
    if ((await notExists(absPath)) || overwriteIfExists) {
      await fs.writeFile(absPath, content, encoding);
    } else if (append) {
      // 如果文件存在且append为true，则在文件尾部追加
      await fs.appendFile(absPath, content, encoding);
    } else {
      throwErr();
    }

    return true; // 写入成功，返回 true
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'EEXIST') {
      if (append || overwriteIfExists) {
        return true; // 文件已存在，且允许追加或覆盖，则返回 true
      } else {
        throwErr();
      }
    }

    throw err;
  }
};

export default write;
