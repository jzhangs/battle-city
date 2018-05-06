import { BLOCK_SIZE, BULLET_SIZE, FIELD_SIZE, TANK_SIZE } from 'utils/consts';
import stageConfigs from 'stages';
import { BulletRecord, TankRecord, EagleRecord, PowerUpRecord } from 'types';

export function sum(iterable: Iterable<number>) {
  let result = 0;
  for (const item of iterable) {
    result += item;
  }
  return result;
}

export function getOrDefault<K, V>(map: Map<K, V>, key: K, getValue: () => V) {
  if (!map.has(key)) {
    map.set(key, getValue());
  }
  return map.get(key);
}

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

export const frame = (x: number) => 1000 / 60 * x;

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
      height: BLOCK_SIZE * (1 + enlargement)
    };
  } else if (item instanceof PowerUpRecord) {
    return {
      x: item.x - BLOCK_SIZE / 2 * enlargement,
      y: item.y - BLOCK_SIZE / 2 * enlargement,
      width: BLOCK_SIZE * (1 + enlargement),
      height: BLOCK_SIZE * (1 + enlargement)
    };
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

export function incTankLevel(tank: TankRecord) {
  if (tank.level === 'basic') {
    return tank.set('level', 'fast');
  } else if (tank.level === 'fast') {
    return tank.set('level', 'power');
  } else {
    return tank.set('level', 'armor');
  }
}

export function getTankBulletLimit(tank: TankRecord) {
  if (tank.side === 'ai' || tank.level === 'basic' || tank.level === 'fast') {
    return 1;
  } else {
    return 2;
  }
}

export function getTankBulletSpeed(tank: TankRecord) {
  if (tank.side === 'player') {
    if (tank.level === 'basic') {
      return 0.12;
    } else {
      return 0.24;
    }
  } else {
    if (tank.level === 'basic') {
      return 0.12;
    } else {
      return 0.24;
    }
  }
}

export function getTankBulletInterval(tank: TankRecord) {
  return 300;
}

export function getTankMoveSpeed(tank: TankRecord) {
  if (tank.side === 'player') {
    return 0.045;
  } else {
    if (tank.level === 'basic') {
      return 0.03;
    } else if (tank.level === 'power') {
      return 0.06;
    } else {
      return 0.045;
    }
  }
}

export function getTankBulletPower(tank: TankRecord) {
  if (tank.side === 'player' && tank.level === 'armor') {
    return 3;
  } else if (tank.side === 'ai' && tank.level === 'power') {
    return 2;
  } else {
    return 1;
  }
}

export function getWithPowerUpProbability(stageName: string) {
  return 0.2 + stageConfigs[stageName].difficulty * 0.05;
}
