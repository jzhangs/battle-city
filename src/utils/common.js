import { UP, DOWN, LEFT, BLOCK_SIZE, FIELD_SIZE, BULLET_SIZE, TANK_SIZE } from 'utils/consts';

import BulletRecord from 'types/BulletRecord';
import TankRecord from 'types/TankRecord';

// Calculte bullet start postion according to postion and
// direction of tank.
export function getBulletStartPosition({ x, y, direction }) {
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

export function testCollide(subject, object, threshhold = 0) {
  return (
    between(subject.x - object.width, object.x, subject.x + subject.width, threshhold) &&
    between(subject.y - object.height, object.y, subject.y + subject.height, threshhold)
  );
}

export function* iterRowsAndCols(itemSize, box) {
  const col1 = Math.floor(box.x / itemSize);
  const col2 = Math.floor((box.x + box.width) / itemSize);
  const row1 = Math.floor(box.y / itemSize);
  const row2 = Math.floor((box.y + box.height) / itemSize);
  for (let row = row1; row <= row2; row += 1) {
    for (let col = col1; col <= col2; col += 1) {
      yield [row, col];
    }
  }
}

export function isInField(box) {
  return between(0, box.x, FIELD_SIZE - box.width) && between(0, box.y, FIELD_SIZE - box.height);
}

const nextIdMap = new Map();
export function getNextId(tag = '') {
  if (nextIdMap.has(tag)) {
    const nextId = nextIdMap.get(tag);
    nextIdMap.set(tag, nextId + 1);
    return nextId;
  }
  nextIdMap.set(tag, 2);
  return 1;
}

export function asBox(item) {
  if (item instanceof BulletRecord) {
    return {
      x: item.x,
      y: item.y,
      width: BULLET_SIZE,
      height: BULLET_SIZE
    };
  } else if (item instanceof TankRecord) {
    return {
      x: item.x,
      y: item.y,
      width: TANK_SIZE,
      height: TANK_SIZE
    };
  }
  throw new Error('Cannot convert to type Box');
}
