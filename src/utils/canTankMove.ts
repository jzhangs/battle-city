import { asBox, isInField, testCollide, iterRowsAndCols } from 'utils/common';
import { BLOCK_SIZE, ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import { TankRecord, State, EagleRecord, TanksMap } from 'types';
import { List } from 'immutable';

function isTankCollidedWithEagle(eagle: EagleRecord, tankTarget: Box, threshhold: number) {
  const eagleBox = {
    x: eagle.x,
    y: eagle.y,
    width: BLOCK_SIZE,
    height: BLOCK_SIZE
  };
  return testCollide(eagleBox, tankTarget, threshhold);
}

function isTankCollidedWithBricks(bricks: List<boolean>, tankTarget: Box, threshhold: number) {
  const itemSize = ITEM_SIZE_MAP.BRICK;
  for (const [row, col] of iterRowsAndCols(itemSize, tankTarget)) {
    const t = row * N_MAP.BRICK + col;
    if (bricks.get(t)) {
      const subject = {
        x: col * itemSize,
        y: row * itemSize,
        width: itemSize,
        height: itemSize
      };
      if (testCollide(subject, tankTarget, threshhold)) {
        return true;
      }
    }
  }
  return false;
}

function isTankCollidedWithSteels(steels: List<boolean>, tankTarget: Box, threshhold: number) {
  const itemSize = ITEM_SIZE_MAP.STEEL;
  for (const [row, col] of iterRowsAndCols(itemSize, tankTarget)) {
    const t = row * N_MAP.STEEL + col;
    if (steels.get(t)) {
      const subject = {
        x: col * itemSize,
        y: row * itemSize,
        width: itemSize,
        height: itemSize
      };
      if (testCollide(subject, tankTarget, threshhold)) {
        return true;
      }
    }
  }
  return false;
}

function isTankCollidedWithRivers(rivers: List<boolean>, tankTarget: Box, threshhold: number) {
  const itemSize = ITEM_SIZE_MAP.RIVER;
  for (const [row, col] of iterRowsAndCols(itemSize, tankTarget)) {
    const t = row * N_MAP.RIVER + col;
    if (rivers.get(t)) {
      const subject = {
        x: col * itemSize,
        y: row * itemSize,
        width: itemSize,
        height: itemSize
      };
      if (testCollide(subject, tankTarget, threshhold)) {
        return true;
      }
    }
  }
  return false;
}

function isTankCollidedWithOtherTanks(activeTanks: TanksMap, tank: TankRecord, tankTarget: Box, threshhold: number) {
  for (const otherTank of activeTanks.values()) {
    if (tank.tankId === otherTank.tankId) {
      continue;
    }
    const subject = asBox(otherTank);
    if (testCollide(subject, tankTarget, threshhold)) {
      return true;
    }
  }
  return false;
}

export default function canTankMove(
  { tanks, map: { bricks, steels, rivers, eagle } }: State,
  tank: TankRecord,
  threshhold = -0.01
) {
  const tankTarget = asBox(tank);

  if (!isInField(tankTarget)) {
    return false;
  }

  if (isTankCollidedWithEagle(eagle, tankTarget, threshhold)) {
    return false;
  }
  if (isTankCollidedWithBricks(bricks, tankTarget, threshhold)) {
    return false;
  }
  if (isTankCollidedWithSteels(steels, tankTarget, threshhold)) {
    return false;
  }
  if (isTankCollidedWithRivers(rivers, tankTarget, threshhold)) {
    return false;
  }

  const activeTanks = tanks.filter(t => t.active);
  if (isTankCollidedWithOtherTanks(activeTanks, tank, tankTarget, threshhold)) {
    return false;
  }

  return true;
}
