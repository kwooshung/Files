import fs from 'fs/promises';
import { dirname } from 'path';
import normalize from '@/normalize';
import notExists from '@/exists/not';
import makeDir from '@/makeDir';

/**
 * 类型：append 为 false，overwrite 为 true (append is false, overwrite is true)
 */
type TWriteAppendFalseOverwriteTrue = {
  append?: false;
  overwrite?: true;
};

/**
 * 类型：append 为 true，overwrite 为 false (append is true, overwrite is false)
 */
type TWriteAppendTrueOverwriteFalse = {
  append?: true;
  overwrite?: false;
};

/**
 * 类型：编码选项 (encoding options)
 */
type TWriteEncodingOption = {
  encoding?: BufferEncoding;
};

/**
 * 类型：写入选项 (write options)
 */
type TWriteOptions = (TWriteAppendFalseOverwriteTrue | TWriteAppendTrueOverwriteFalse) & TWriteEncodingOption;

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
