const { parseDuration } = require('./parse-duration');

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

test('number is treated as days (backward compatible)', () => {
  expect(parseDuration(0)).toBe(0);
  expect(parseDuration(1)).toBe(DAY);
  expect(parseDuration(7)).toBe(7 * DAY);
});

test('Infinity stays Infinity', () => {
  expect(parseDuration(Infinity)).toBe(Infinity);
});

test('parses day strings', () => {
  expect(parseDuration('1d')).toBe(DAY);
  expect(parseDuration('3d')).toBe(3 * DAY);
});

test('parses hour strings', () => {
  expect(parseDuration('2h')).toBe(2 * HOUR);
  expect(parseDuration('12h')).toBe(12 * HOUR);
});

test('parses minute strings', () => {
  expect(parseDuration('30m')).toBe(30 * MINUTE);
  expect(parseDuration('5m')).toBe(5 * MINUTE);
});

test('parses combined duration strings', () => {
  expect(parseDuration('1d12h')).toBe(DAY + 12 * HOUR);
  expect(parseDuration('1d6h30m')).toBe(DAY + 6 * HOUR + 30 * MINUTE);
  expect(parseDuration('2h30m')).toBe(2 * HOUR + 30 * MINUTE);
});

test('case insensitive', () => {
  expect(parseDuration('1D')).toBe(DAY);
  expect(parseDuration('2H')).toBe(2 * HOUR);
  expect(parseDuration('30M')).toBe(30 * MINUTE);
  expect(parseDuration('1D6H30M')).toBe(DAY + 6 * HOUR + 30 * MINUTE);
});

test('throws on invalid string', () => {
  expect(() => parseDuration('abc')).toThrow('Invalid duration string');
  expect(() => parseDuration('')).toThrow('Invalid duration string');
});

test('throws on invalid type', () => {
  expect(() => parseDuration(null)).toThrow('Invalid duration value');
  expect(() => parseDuration(undefined)).toThrow('Invalid duration value');
});
