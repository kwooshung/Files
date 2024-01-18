import { TFileUnit } from '../interface';

/**
 * 将数字，转换为带单位的体积尺寸 (Convert file size to file size with unit)
 * @param {number | bigint} size 文件体积 (file size)
 * @param {number} [precision=2] 精度 (precision)
 * @returns {TFileSizeWithUnit} 带单位的文件体积 (file size with unit)
 */
const human = (size: number | bigint, precision: number = 2): { size: number; unit: TFileUnit } => {
  // 确保 size 是 number 类型
  let numSize = Number(size);
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;

  while (numSize >= 1024 && index < units.length - 1) {
    numSize /= 1024; // 此时 numSize 确定为 number 类型
    index++;
  }

  return { size: Number(numSize.toFixed(precision)), unit: units[index] as any };
};

export default human;
