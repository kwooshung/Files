import fs from 'fs/promises';
import { dirname } from 'path';
import normalize from '@/normalize';
import notExists from '@/exists/not';
import makeDir from '@/makeDir';

/**
 * 写入选项 (write options)
 */
type TWriteOptions = {
  /**
   * 是否追加 (whether to append)
   */
  append?: boolean;
  /**
   * 如果文件已存在，是否覆盖 (if the file already exists, whether to overwrite)
   */
  overwrite?: boolean;
  /**
   * 文件的编码格式，默认为 utf8 (the encoding format of the file, default is utf8)
   */
  encoding?: BufferEncoding;
} & ({ append: true; overwrite?: boolean } | { append?: boolean; overwrite: true } | { overwrite?: true; encoding: BufferEncoding });

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
 * @param {TWriteOptions} options 写入选项 (write options)
 * @returns {Promise<boolean>} 如果写入成功，则返回 `true`；否则返回 `false (if the write is successful, `true` is returned; otherwise `false` is returned)
 */
const write = async (filePath: string, content: string, options: TWriteOptions = { overwrite: true, encoding: 'utf8' }): Promise<boolean> => {
  const { append = false, overwrite = true, encoding = 'utf8' } = options;

  try {
    const absPath = normalize(filePath);
    const dirPath = dirname(absPath);

    await makeDir(dirPath);

    if ((await notExists(absPath)) || overwrite) {
      await fs.writeFile(absPath, content, { encoding });
    } else if (append) {
      await fs.appendFile(absPath, content, { encoding });
    } else {
      throwErr();
    }

    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
      if (append || overwrite) {
        return true;
      } else {
        throwErr();
      }
    }

    throw err;
  }
};

export default write;
