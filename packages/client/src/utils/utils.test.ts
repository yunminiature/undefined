import { isBaseQueryError } from './utils';

describe('isBaseQueryError()', () => {
  it('should return true for HTTP-like error with numeric status', () => {
    const err: unknown = { status: 404, data: { message: 'Not Found' } };
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return true for FETCH_ERROR shape', () => {
    const err: unknown = { status: 'FETCH_ERROR', error: 'TypeError: failed to fetch' };
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return true for PARSING_ERROR shape', () => {
    const err: unknown = {
      status: 'PARSING_ERROR',
      originalStatus: 200,
      data: 'OK',
      error: 'SyntaxError',
    };
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return true for CUSTOM_ERROR shape', () => {
    const err: unknown = { status: 'CUSTOM_ERROR', data: { any: 'payload' } };
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return true when "status" comes from the prototype chain', () => {
    const proto = { status: 500 };
    const err = Object.create(proto);
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return true for null-prototype objects that have own "status"', () => {
    const err = Object.create(null) as Record<string, unknown>;
    err.status = 400;
    expect(isBaseQueryError(err)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isBaseQueryError(null as unknown)).toBe(false);
    expect(isBaseQueryError(undefined as unknown)).toBe(false);
  });

  it('should return false for plain objects without "status"', () => {
    expect(isBaseQueryError({})).toBe(false);
    expect(isBaseQueryError({ message: 'oops' })).toBe(false);
    expect(isBaseQueryError([])).toBe(false);
  });

  it('should return false for primitives and functions', () => {
    expect(isBaseQueryError('oops' as unknown)).toBe(false);
    expect(isBaseQueryError(123 as unknown)).toBe(false);
    expect(isBaseQueryError(true as unknown)).toBe(false);
    expect(isBaseQueryError(Symbol('x') as unknown)).toBe(false);
    expect(isBaseQueryError(10n as unknown)).toBe(false);
  });

  it('should return false for non-RTK error-like objects without "status"', () => {
    expect(isBaseQueryError(new Error('fail') as unknown)).toBe(false);
    expect(isBaseQueryError(new Date() as unknown)).toBe(false);
    expect(isBaseQueryError(new Map() as unknown)).toBe(false);
  });
});
