import human from '.';

describe('@/size/human', () => {
  it('正确转换不同单位的文件大小', () => {
    // 测试不同大小的文件转换
    expect(human(500)).toEqual({ size: 500, unit: 'B' });
    expect(human(1024)).toEqual({ size: 1, unit: 'KB' });
    expect(human(1024 * 1024)).toEqual({ size: 1, unit: 'MB' });
    expect(human(1024 * 1024 * 1024)).toEqual({ size: 1, unit: 'GB' });
    expect(human(1024 * 1024 * 1024 * 1024)).toEqual({ size: 1, unit: 'TB' });
    expect(human(1024n * 1024n * 1024n * 1024n * 1024n)).toEqual({ size: 1, unit: 'PB' });
    expect(human(1024n * 1024n * 1024n * 1024n * 1024n * 1024n)).toEqual({ size: 1, unit: 'EB' });
    expect(human(1024n * 1024n * 1024n * 1024n * 1024n * 1024n * 1024n)).toEqual({ size: 1, unit: 'ZB' });
    expect(human(1024n * 1024n * 1024n * 1024n * 1024n * 1024n * 1024n * 1024n)).toEqual({ size: 1, unit: 'YB' });
  });

  it('处理边界值', () => {
    // 测试接近转换点的值
    expect(human(1023)).toEqual({ size: 1023, unit: 'B' });
    expect(human(1024 + 512)).toEqual({ size: 1.5, unit: 'KB' });
  });

  it('处理非标准和非法输入', () => {
    // 测试非标准和非法输入
    expect(human(-1024)).toEqual({ size: -1024, unit: 'B' });
    expect(human(NaN)).toEqual({ size: NaN, unit: 'B' });
  });
});
