import { asBox, isInField, testCollide, iterRowsAndCols } from 'utils/common';
import { BLOCK_SIZE, ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import * as selectors from 'utils/selectors';

function isTankCollidedWithEagle(eagle, tankTarget, threshhold) {
  const eagleBox = {
    x: eagle.get('x'),
    y: eagle.get('y'),
    width: BLOCK_SIZE,
    height: BLOCK_SIZE
  };
  return testCollide(eagleBox, tankTarget, threshhold);
}

function isTankCollidedWithBricks(bricks, tankTarget, threshhold) {
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

function isTankCollidedWithSteels(steels, tankTarget, threshhold) {
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

function isTankCollidedWithRivers(rivers, tankTarget, threshhold) {
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

function isTankCollidedWithOtherTanks(tanks, tank, tankTarget, threshhold) {
  for (const otherTank of tanks.values()) {
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

export default function canTankMove(state, tank, threshhold = -0.01) {
  const tankTarget = asBox(tank);

  if (!isInField(tankTarget)) {
    return false;
  }

  const { bricks, steels, rivers, eagle } = selectors.map(state).toObject();
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

  if (isTankCollidedWithOtherTanks(selectors.tanks(state), tank, tankTarget, threshhold)) {
    return false;
  }

  return true;
}
