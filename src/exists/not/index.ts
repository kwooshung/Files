import exists from '@/exists';

/**
 * 检查文件或文件夹路径是否不存在 (check if a file or folder path does not exist)
 * @param {string | string[]} paths 要检查的路径，可以是单个路径字符串或路径字符串数组 (the path to check, can be a single path string or path string array)
 * @param {boolean} [anyNotExists=false] 如果为 true，则有任意一个路径不存在即返回 true；如果为 false，则所有路径都必须不存在才返回 true (if `true`, any path that does not exist will return `true`; if `false`, all paths must not exist to return `true`)
 * @returns {Promise<boolean>} 路径是否不存在 (whether the path does not exist)
 */
const not = async (paths: string | string[], anyNotExists: boolean = false): Promise<boolean> => !(await exists(paths, !anyNotExists));

export default not;
