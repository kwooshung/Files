import path from 'path';
import normalize from '.';

describe('@/normalize', () => {
  it('应该正确标准化普通路径', () => {
    const inputPath = ['user', 'docs', 'letter.txt'].join(path.sep);
    const expectedPath = ['user', 'docs', 'letter.txt'].join(path.sep);
    expect(normalize(inputPath)).toBe(expectedPath);
  });

  it('应该处理含有 "." 和 ".." 的路径', () => {
    const inputPath = ['user', 'docs', '..', 'docs', '.', 'letter.txt'].join(path.sep);
    const expectedPath = ['user', 'docs', 'letter.txt'].join(path.sep);
    expect(normalize(inputPath)).toBe(expectedPath);
  });

  it('应该处理空字符串', () => {
    const inputPath = '';
    expect(normalize(inputPath)).toBe('.');
  });

  it('应该处理根路径', () => {
    const inputPath = path.sep;
    expect(normalize(inputPath)).toBe(path.sep);
  });

  it('对于非字符串输入应该抛出错误', () => {
    const inputPath: any = null;
    expect(() => normalize(inputPath)).toThrowError();
  });
});
