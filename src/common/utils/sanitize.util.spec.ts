import { SanitizeUtil } from './sanitize.util';

describe('SanitizeUtil', () => {
  it('strips html tags from strings', () => {
    expect(SanitizeUtil.deep('<script>alert(1)</script>hello')).toBe('hello');
  });

  it('keeps ampersands readable', () => {
    expect(SanitizeUtil.deep('Tom & Jerry')).toBe('Tom & Jerry');
  });

  it('cleans nested objects and arrays', () => {
    expect(SanitizeUtil.deep({ tags: ['<b>a</b>'], user: { name: '<i>Sam</i>' } })).toEqual({
      tags: ['a'],
      user: { name: 'Sam' },
    });
  });

  it('leaves passwords untouched', () => {
    expect(SanitizeUtil.deep({ password: 'a<b&c' })).toEqual({ password: 'a<b&c' });
  });

  it('drops prototype pollution keys', () => {
    const polluted = JSON.parse('{"__proto__":{"admin":true},"name":"x"}');
    const clean = SanitizeUtil.deep(polluted) as Record<string, unknown>;
    expect(Object.keys(clean)).toEqual(['name']);
    expect(({} as Record<string, unknown>).admin).toBeUndefined();
  });
});
