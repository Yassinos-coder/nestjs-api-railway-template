import { FilterXSS } from 'xss';

export class SanitizeUtil {
  private static readonly FILTER = new FilterXSS({
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
  private static readonly SKIPPED_KEYS = new Set(['password', 'currentPassword', 'newPassword', 'token']);
  private static readonly UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  static deep(value: unknown): unknown {
    if (typeof value === 'string') return SanitizeUtil.cleanString(value);
    if (Array.isArray(value)) return value.map((item) => SanitizeUtil.deep(item));
    if (value === null || typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !SanitizeUtil.UNSAFE_KEYS.has(key))
        .map(([key, item]) => [key, SanitizeUtil.SKIPPED_KEYS.has(key) ? item : SanitizeUtil.deep(item)]),
    );
  }

  private static cleanString(value: string): string {
    return SanitizeUtil.FILTER.process(value).trim();
  }
}
