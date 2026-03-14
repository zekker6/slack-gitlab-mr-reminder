const UNITS = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
};

/**
 * Parse a threshold value into milliseconds.
 * - Number: treated as days (backward compatible)
 * - String: e.g. "2h", "30m", "1d12h", "1d6h30m"
 */
exports.parseDuration = (value) => {
  if (typeof value === 'number') {
    return value * UNITS.d;
  }

  if (typeof value !== 'string') {
    throw new Error(`Invalid duration value: ${value}`);
  }

  const pattern = /(\d+)\s*(d|h|m)/gi;
  let total = 0;
  let match;
  let matched = false;

  while ((match = pattern.exec(value)) !== null) {
    matched = true;
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    total += amount * UNITS[unit];
  }

  if (!matched) {
    throw new Error(`Invalid duration string: "${value}". Use combinations of d, h, m (e.g. "1d", "2h", "30m", "1d6h30m")`);
  }

  return total;
};
