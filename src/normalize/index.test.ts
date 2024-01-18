import { sep, join } from 'path';
import normalize from '@/normalize';

describe('@/normalize', () => {
  it('应正确处理普通路径', () => {
    const testPath = join('src', 'utils', 'test.js');
    expect(normalize(testPath)).toBe(testPath.split('/').join(sep));
  });

  it('应正确处理带有特殊字符的路径', () => {
    const testPath = join('src', '*', 'utils?', 'test.js');
    expect(normalize(testPath)).toBe(testPath.split('/').join(sep));
  });

  it('应正确处理相对路径', () => {
    const testPath = join('..', 'src', 'utils', 'test.js');
    expect(normalize(testPath)).toBe(testPath.split('/').join(sep));
  });

  it('应正确处理根路径', () => {
    expect(normalize(sep)).toBe(sep);
  });

  it('应正确处理空字符串', () => {
    expect(normalize('')).toBe('.');
  });

  it('应正确处理仅包含特殊字符的路径', () => {
    const testPath = '***';
    expect(normalize(testPath)).toBe(testPath);
  });

  it('应正确处理带有多个斜杠的路径', () => {
    const testPath = 'src///utils/test.js';
    expect(normalize(testPath)).toBe(join('src', 'utils', 'test.js').split('/').join(sep));
  });

  it('应正确处理带有反斜杠的路径', () => {
    const testPath = 'src\\utils\\test.js';
    expect(normalize(testPath)).toBe(testPath.split('/').join(sep));
  });
});
