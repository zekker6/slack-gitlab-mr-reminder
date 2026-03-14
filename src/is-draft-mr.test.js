const { isDraftMr } = require('./is-draft-mr');

test('detects draft via API field', () => {
  expect(isDraftMr({ draft: true, title: 'Normal title' })).toBeTruthy();
});

test('detects draft via title prefix when API field is false', () => {
  expect(isDraftMr({ draft: false, title: 'Draft: some MR' })).toBeTruthy();
  expect(isDraftMr({ draft: false, title: 'WIP: some MR' })).toBeTruthy();
  expect(isDraftMr({ draft: false, title: '[Draft] some MR' })).toBeTruthy();
  expect(isDraftMr({ draft: false, title: '[WIP] some MR' })).toBeTruthy();
});

test('detects draft via title prefix when API field is missing', () => {
  expect(isDraftMr({ title: 'Draft: some MR' })).toBeTruthy();
  expect(isDraftMr({ title: 'WIP: some MR' })).toBeTruthy();
});

test('not a draft', () => {
  expect(isDraftMr({ draft: false, title: 'Normal MR' })).toBeFalsy();
  expect(isDraftMr({ title: 'Normal MR' })).toBeFalsy();
});

test('API field takes priority over title check', () => {
  expect(isDraftMr({ draft: true, title: 'Normal MR without prefix' })).toBeTruthy();
});
