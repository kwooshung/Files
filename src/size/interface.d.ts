/**
 * 类型：文件体积 (file size)
 */
type TFileSize = {
  /**
   * 文件路径 (file path)
   */
  path: string;
  /**
   * 文件体积 (file size)
   */
  size: number | bigint;
};

/**
 * 类型：文件体积单位 (file size unit)
 */
type TFileUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';

/**
 * 类型：文件体积含单位 (file size with unit)
 */
type TFileSizeWithUnit = TFileSize & {
  /**
   * 文件体积含单位 (file size with unit)
   */
  unit: {
    /**
     * 文件体积 (file size with unit)
     */
    size: number;
    /**
     * 文件体积单位 (file size unit)
     */
    unit: TFileUnit;
  };
};

export { TFileSize, TFileUnit, TFileSizeWithUnit };
