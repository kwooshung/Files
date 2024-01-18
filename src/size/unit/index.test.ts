import { TFileSize } from '../interface';
import unit from '.';

describe('@/size/unit', () => {
  it('转换单个文件大小', () => {
    const fileSize: TFileSize = { path: 'test.txt', size: 1024 };
    const result = unit(fileSize);
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('test.txt');
    expect(result[0].unit.size).toBeGreaterThan(0);
    expect(result[0].unit.unit).toMatch(/B|KB|MB|GB|TB|PB|EB|ZB|YB/);
  });

  it('转换多个文件大小', () => {
    const fileSizes: TFileSize[] = [
      { path: 'test.txt', size: 1024 },
      { path: 'test2.txt', size: 2048 }
    ];
    const results = unit(fileSizes);
    expect(results).toHaveLength(2);
    results.forEach((result) => {
      expect(result.unit.size).toBeGreaterThan(0);
      expect(result.unit.unit).toMatch(/B|KB|MB|GB|TB|PB|EB|ZB|YB/);
    });
  });

  it('处理字节（B）的文件大小', () => {
    const fileSize: TFileSize = { path: 'bfile.txt', size: 128 }; // 128B
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(128);
    expect(result[0].unit.unit).toBe('B');
  });

  it('处理千字节（KB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'kbfile.txt', size: 1024 * 2 }; // 2KB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(2);
    expect(result[0].unit.unit).toBe('KB');
  });

  it('处理兆字节（MB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'kbfile.txt', size: 1024 * 1024 }; // 1MB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(1);
    expect(result[0].unit.unit).toBe('MB');
  });

  it('处理千兆字节（GB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'gbfile.txt', size: 1024 * 1024 * 1024 * 3 }; // 3GB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(3);
    expect(result[0].unit.unit).toBe('GB');
  });

  it('处理太字节（TB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'tbfile.txt', size: 1024 * 1024 * 1024 * 1024 * 2 }; // 2TB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(2);
    expect(result[0].unit.unit).toBe('TB');
  });

  it('处理拍字节（PB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'pbfile.txt', size: BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1) }; // 1PB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(1);
    expect(result[0].unit.unit).toBe('PB');
  });

  it('处理艾字节（EB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'ebfile.txt', size: BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1) }; // 1EB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(1);
    expect(result[0].unit.unit).toBe('EB');
  });

  it('处理泽字节（ZB）的文件大小', () => {
    // 注意：这里的数值超出了 JavaScript 中 Number 类型的最大安全整数范围
    const fileSize: TFileSize = { path: 'zbfile.txt', size: BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1) }; // 1ZB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(1);
    expect(result[0].unit.unit).toBe('ZB');
  });

  it('处理尧字节（YB）的文件大小', () => {
    const fileSize: TFileSize = { path: 'ybfile.txt', size: BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1024) * BigInt(1) }; // 1YB
    const result = unit(fileSize);
    expect(result[0].unit.size).toBeCloseTo(1);
    expect(result[0].unit.unit).toBe('YB');
  });
});
