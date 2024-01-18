import { TFileSize, TFileUnit, TFileSizeWithUnit } from '../interface';

/**
 * 将文件大小转换为带单位的文件大小 (Convert file size to file size with unit)
 * @param {number | bigint} size 文件大小 (file size)
 * @returns {TFileSizeWithUnit} 带单位的文件大小 (file size with unit)
 */
const convertSize = (size: number | bigint): { size: number; unit: TFileUnit } => {
  // 确保 size 是 number 类型
  let numSize = Number(size);
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;

  while (numSize >= 1024 && index < units.length - 1) {
    numSize /= 1024; // 此时 numSize 确定为 number 类型
    index++;
  }

  return { size: Number(numSize.toFixed(2)), unit: units[index] as any };
};

/**
 * 将文件大小转换为带单位的文件大小 (Convert file size to file size with unit)
 * @param {TFileSize | TFileSize[]} sizes 文件大小 (file size)
 * @returns {TFileSizeWithUnit[]} 带单位的文件大小 (file size with unit)
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

export default unit;
