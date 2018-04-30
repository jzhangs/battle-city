import { FIELD_SIZE, UP, DOWN, LEFT, BLOCK_SIZE } from 'utils/consts';

// Calculte bullet start postion according to postion and
// direction of tank.
export function getBulletStartPosition(x, y, direction) {
  switch (direction) {
    case UP:
      return { x: x + 6, y: y - 3 };
    case DOWN:
      return { x: x + 6, y: y + BLOCK_SIZE };
    case LEFT:
      return { x: x - 3, y: y + 6 };
    default:
      // RIGHT
      return { x: x + BLOCK_SIZE, y: y + 6 };
  }
}

export function between(min, value, max, threshhold = 0) {
  return min - threshhold <= value && value <= max + threshhold;
}

export function getRowCol(t, N) {
  return [Math.floor(t / N), t % N];
}

export function filterCollide(target, itemSize, itemList, threshhold = 0) {
  const { x, y, width, height } = target;
  const left = x / itemSize - 1;
  const right = (x + width) / itemSize;
  const top = y / itemSize - 1;
  const bottom = (y + height) / itemSize;
  const N = FIELD_SIZE / itemSize;
  return itemList.toMap().filter((set, t) => {
    if (set) {
      const [row, col] = getRowCol(t, N);
      return between(left, col, right, threshhold) && between(top, row, bottom, threshhold);
    }
    return false;
  });
}

export function testCollide(target, itemSize, itemList, threshhold) {
  return filterCollide(target, itemSize, itemList, threshhold).count() > 0;
}

export function testCollide2(subject, object, threshhold = 0) {
  return (
    between(subject.x - object.width, object.x, subject.x + subject.width, threshhold) &&
    between(subject.y - object.height, object.y, subject.y + subject.height, threshhold)
  );
}
