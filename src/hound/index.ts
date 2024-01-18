import FileHound from 'filehound';

/**
 * FileHound 包装器，用于创建一个新的 FileHound 实例 (FileHound wrapper, used to create a new FileHound instance)
 * @apilink https://nspragg.github.io/filehound/
 * @param {FileHound.FileHound[]} instances FileHound 实例，当传入此参数时，将会调用 FileHound.any() 方法，将多个实例合并为一个实例 (FileHound instance, when this parameter is passed in, the FileHound.any() method will be called to merge multiple instances into one instance)
 * @returns {FileHound.FileHound[]} FileHound 实例 (FileHound instance)
 */
const Hound = (...instances: FileHound.FileHound[]): FileHound.FileHound[] => (instances.length > 0 ? FileHound['any'](...instances) : [FileHound.create()]);

export default Hound;
