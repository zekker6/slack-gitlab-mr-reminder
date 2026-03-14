exports.isWipMr = mrTitle => {
  const normalized = mrTitle
    .toLowerCase()
    .trim();
  const first7 = normalized.slice(0, 7);
  if (first7 === '[draft]') {
    return true;
  }
  const first6 = first7.slice(0, 6);
  if (first6 === 'draft:') {
    return true;
  }
  const first5 = first6.slice(0, 5);
  if (first5 === '[wip]') {
    return true;
  }
  const first4 = first5.slice(0, 4);
  if (first4 === 'wip:') {
    return true;
  }
  return false;
};
