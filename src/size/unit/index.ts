import convertSize from '../human';
import { TFileSize, TFileSizeWithUnit } from '../interface';

/**
 * 将指定路径或多个路径的体积，转换为带单位的文件体积 (Convert file size to file size with unit)
 * @param {TFileSize | TFileSize[]} sizes 文件体积 (file size)
 * @returns {TFileSizeWithUnit[]} 带单位的文件体积 (file size with unit)
 */
const unit = (sizes: TFileSize | TFileSize[]): TFileSizeWithUnit[] => {
  !Array.isArray(sizes) && (sizes = [sizes]);

  return sizes.map((sizeObj) => {
    const convertedSize = convertSize(sizeObj.size);
    return {
      path: sizeObj.path,
      size: sizeObj.size,
      unit: convertedSize
    };
  });
};

export { convertSize };
export default unit;
