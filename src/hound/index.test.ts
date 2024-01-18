import FileHound from 'filehound';
import Hound from '.';

jest.mock('filehound', () => ({
  create: jest.fn(),
  any: jest.fn()
}));

describe('Hound', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('应当创建一个新的 FileHound 实例', () => {
    (FileHound.create as any).mockReturnValue('新实例');
    const result = Hound();
    expect(FileHound.create).toHaveBeenCalled();
    expect(result).toEqual(['新实例']);
  });

  it('当传入实例时，应调用 FileHound.any 合并实例', () => {
    const mockInstances: any = ['实例1', '实例2'];
    (FileHound as any).any.mockReturnValue('合并后的实例');

    const result = Hound(...mockInstances);
    expect((FileHound as any).any).toHaveBeenCalledWith(...mockInstances);
    expect(result).toEqual('合并后的实例');
  });

  it('当没有传入实例时，不应调用 FileHound.any', () => {
    (FileHound.create as any).mockReturnValue('新实例');
    Hound();
    expect((FileHound as any).any).not.toHaveBeenCalled();
  });
});
