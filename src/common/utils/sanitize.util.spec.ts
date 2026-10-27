import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SanitizeUtil } from './sanitize.util';

describe('SanitizeUtil', () => {
  it('strips html tags from strings', () => {
    assert.equal(SanitizeUtil.deep('<script>alert(1)</script>hello'), 'hello');
  });

  it('keeps ampersands readable', () => {
    assert.equal(SanitizeUtil.deep('Tom & Jerry'), 'Tom & Jerry');
  });

  it('cleans nested objects and arrays', () => {
    assert.deepEqual(SanitizeUtil.deep({ tags: ['<b>a</b>'], user: { name: '<i>Sam</i>' } }), {
      tags: ['a'],
      user: { name: 'Sam' },
    });
  });

  it('leaves passwords untouched', () => {
    assert.deepEqual(SanitizeUtil.deep({ password: 'a<b&c' }), { password: 'a<b&c' });
  });

  it('drops prototype pollution keys', () => {
    const polluted = JSON.parse('{"__proto__":{"admin":true},"name":"x"}');
    const clean = SanitizeUtil.deep(polluted) as Record<string, unknown>;
    assert.deepEqual(Object.keys(clean), ['name']);
    assert.equal(({} as Record<string, unknown>).admin, undefined);
  });
});
