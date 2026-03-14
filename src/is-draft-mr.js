const { isWipMr } = require('./is-wip-mr');

/**
 * Check if a merge request is a draft/WIP.
 * Checks the API `draft` field first, then falls back to title prefix detection.
 */
exports.isDraftMr = (mr) => {
  if (mr.draft === true) {
    return true;
  }
  return isWipMr(mr.title);
};
