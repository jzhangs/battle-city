import * as common from 'utils/common';

test('between', () => {
  expect(common.between(1, 2, 3)).toBe(true);
  expect(common.between(4, 6, 5)).toBe(false);
});
