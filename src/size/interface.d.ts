/**
 * 类型：文件大小 (file size)
 */
type TFileSize = {
  /**
   * 文件路径 (file path)
   */
  path: string;
  /**
   * 文件大小 (file size)
   */
  size: number | bigint;
};

/**
 * 类型：文件大小单位 (file size unit)
 */
type TFileUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';

/**
 * 类型：文件大小含单位 (file size with unit)
 */
type TFileSizeWithUnit = TFileSize & {
  /**
   * 文件大小含单位 (file size with unit)
   */
  unit: {
    /**
     * 文件大小 (file size with unit)
     */
    size: number;
    /**
     * 文件大小单位 (file size unit)
     */
    unit: TFileUnit;
  };
};

export { TFileSize, TFileUnit, TFileSizeWithUnit };
