import { normalize as _normalize } from 'path';

/**
 * 标准化路径(normalize path)
 * @param {string} source 要标准化的路径 (source path)
 * @returns {string} 标准化后的路径 (normalized path)
 */
const normalize = (source: string): string => _normalize(source);

export default normalize;
