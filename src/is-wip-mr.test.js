const { isWipMr } = require('./is-wip-mr');

test('Bracket WIP case-insensitive', async () => {
  expect(isWipMr(' [wiP]true')).toBeTruthy();
});

test('Colon WIP case-insensitive', async () => {
  expect(isWipMr(' wiP:true')).toBeTruthy();
});

test('Bracket Draft case-insensitive', async () => {
  expect(isWipMr(' [Draft] MR title')).toBeTruthy();
  expect(isWipMr('[DRAFT] MR title')).toBeTruthy();
  expect(isWipMr(' [drAFt]title')).toBeTruthy();
});

test('Colon Draft case-insensitive', async () => {
  expect(isWipMr('Draft: MR title')).toBeTruthy();
  expect(isWipMr(' draft: MR title')).toBeTruthy();
  expect(isWipMr(' DRAFT:title')).toBeTruthy();
});

test('not a WIP or Draft', async () => {
  expect(isWipMr(' [wi P]true')).toBeFalsy();
  expect(isWipMr(' w iP:true')).toBeFalsy();
  expect(isWipMr(' [dra ft] title')).toBeFalsy();
  expect(isWipMr(' dra ft: title')).toBeFalsy();
});
