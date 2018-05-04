import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { BLOCK_SIZE, BULLET_SIZE, FIELD_SIZE, TANK_SIZE, TANK_SPAWN_DELAY } from 'utils/consts';
import { BulletRecord, TankRecord, EagleRecord, PowerUpRecord } from 'types';

// Calculte bullet start postion according to postion and
// direction of tank.
export function getBulletStartPosition({ x, y, direction }: { x: number; y: number; direction: Direction }) {
  switch (direction) {
    case 'up':
      return { x: x + 6, y: y - 3 };
    case 'down':
      return { x: x + 6, y: y + BLOCK_SIZE };
    case 'left':
      return { x: x - 3, y: y + 6 };
    default:
      // right
      return { x: x + BLOCK_SIZE, y: y + 6 };
  }
}

export function between(min: number, value: number, max: number, threshhold = 0) {
  return min - threshhold <= value && value <= max + threshhold;
}

export function getRowCol(t: number, N: number) {
  return [Math.floor(t / N), t % N];
}

export function testCollide(subject: Box, object: Box, threshhold = 0) {
  return (
    between(subject.x - object.width, object.x, subject.x + subject.width, threshhold) &&
    between(subject.y - object.height, object.y, subject.y + subject.height, threshhold)
  );
}

export function* iterRowsAndCols(itemSize: number, box: Box) {
  const N = FIELD_SIZE / itemSize; // todo should not use N
  const col1 = Math.max(0, Math.floor(box.x / itemSize));
  const col2 = Math.min(N - 1, Math.floor((box.x + box.width) / itemSize));
  const row1 = Math.max(0, Math.floor(box.y / itemSize));
  const row2 = Math.min(N - 1, Math.floor((box.y + box.height) / itemSize));
  for (let row = row1; row <= row2; row += 1) {
    for (let col = col1; col <= col2; col += 1) {
      yield [row, col];
    }
  }
}

export function isInField(box: Box) {
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

export function asBox(item: BulletRecord | TankRecord | EagleRecord | PowerUpRecord, enlargement = 0): Box {
  if (item instanceof BulletRecord) {
    return {
      x: item.x - BULLET_SIZE / 2 * enlargement,
      y: item.y - BULLET_SIZE / 2 * enlargement,
      width: BULLET_SIZE * (1 + enlargement),
      height: BULLET_SIZE * (1 + enlargement)
    };
  } else if (item instanceof TankRecord) {
    return {
      x: item.x - TANK_SIZE / 2 * enlargement,
      y: item.y - TANK_SIZE / 2 * enlargement,
      width: TANK_SIZE * (1 + enlargement),
      height: TANK_SIZE * (1 + enlargement)
    };
  } else if (item instanceof EagleRecord) {
    return {
      x: item.x - BLOCK_SIZE / 2 * enlargement,
      y: item.y - BLOCK_SIZE / 2 * enlargement,
      width: BLOCK_SIZE * (1 + enlargement),
      height: BLOCK_SIZE * (1 + enlargement),
    }
  } else if (item instanceof PowerUpRecord) {
    return {
      x: item.x - BLOCK_SIZE / 2 * enlargement,
      y: item.y - BLOCK_SIZE / 2 * enlargement,
      width: BLOCK_SIZE * (1 + enlargement),
      height: BLOCK_SIZE * (1 + enlargement),
    }
  } else {
    throw new Error('Cannot convert to type Box');
  }
}

type UpdaterMaker = (amount: number) => (x: number) => number;
export const inc: UpdaterMaker = amount => x => x + amount;
export const dec: UpdaterMaker = amount => x => x - amount;

export function getDirectionInfo(direction: Direction, flipxy = false) {
  let result: { xy: 'x' | 'y'; updater: UpdaterMaker };
  if (direction === 'up') {
    result = { xy: 'y', updater: dec };
  } else if (direction === 'down') {
    result = { xy: 'y', updater: inc };
  } else if (direction === 'left') {
    result = { xy: 'x', updater: dec };
  } else if (direction === 'right') {
    result = { xy: 'x', updater: inc };
  } else {
    throw new Error('Invalid direction');
  }
  if (flipxy) {
    result.xy = result.xy === 'x' ? 'y' : 'x';
  }
  return result;
}

export function* spawnTank(tank: TankRecord) {
  yield put({
    type: 'SPAWN_FLICKER',
    flickerId: getNextId('flicker'),
    x: tank.x,
    y: tank.y
  });
  yield delay(TANK_SPAWN_DELAY);
  const tankId = getNextId('tank');
  yield put({
    type: 'SPAWN_TANK',
    tank: tank.set('tankId', tankId)
  });
  return tankId;
}

export function reverseDirection(direction: Direction): Direction {
  if (direction === 'up') {
    return 'down';
  }
  if (direction === 'down') {
    return 'up';
  }
  if (direction === 'left') {
    return 'right';
  }
  if (direction === 'right') {
    return 'left';
  }
}
