import * as R from 'ramda';
import { is, Set as ISet } from 'immutable';
import { put, select, fork, take } from 'redux-saga/effects';
import {
  BULLET_SIZE,
  BLOCK_SIZE,
  DIRECTION_MAP,
  ITEM_SIZE_MAP,
  N_MAP,
  UP,
  DOWN,
  SIDE
} from 'utils/consts';
import { testCollide, isInField } from 'utils/common';

import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

function isBulletInField(bullet) {
  return isInField({
    x: bullet.x,
    y: bullet.y,
    width: BULLET_SIZE,
    height: BULLET_SIZE
  });
}

function makeExplosionFromBullet(bullet) {
  return put({
    type: A.SPAWN_EXPLOSION,
    x: bullet.x - 6,
    y: bullet.y - 6,
    explosionType: 'bullet',
    explosionId: nextExplosionId++
  });
}

function* handleTick() {
  while (true) {
    const { delta } = yield take(A.TICK);
    const bullets = yield select(selectors.bullets);
    if (bullets.isEmpty()) {
      continue;
    }
    const updatedBullets = bullets.map((bullet) => {
      const { direction, speed } = bullet;
      const distance = speed * delta;
      const [xy, incdec] = DIRECTION_MAP[direction];
      return bullet.update(xy, incdec === 'inc' ? R.add(distance) : R.subtract(R.__, distance));
    });
    yield put({ type: A.UPDATE_BULLETS, updatedBullets });
  }
}

function* handleBulletsCollidedWithBricks(context) {
  const bullets = yield select(selectors.bullets);
  const bricks = yield select(selectors.map.bricks);

  const N = N_MAP.BRICK;
  const itemSize = ITEM_SIZE_MAP.BRICK;

  bulletLoop: for (const bullet of bullets.values()) {
    const col1 = Math.floor(bullet.x / itemSize);
    const col2 = Math.floor((bullet.x + BULLET_SIZE) / itemSize);
    const row1 = Math.floor(bullet.y / itemSize);
    const row2 = Math.floor((bullet.y + BULLET_SIZE) / itemSize);
    for (let row = row1; row <= row2; row += 1) {
      for (let col = col1; col <= col2; col += 1) {
        const t = row * N + col;
        if (bricks.get(t)) {
          context.expBulletOwners.add(bullet.owner);
          continue bulletLoop;
        }
      }
    }
  }
}

function* handleBulletsCollidedWithSteels(context) {
  const bullets = yield select(selectors.bullets);
  const steels = yield select(selectors.map.steels);

  const N = N_MAP.STEEL;
  const itemSize = ITEM_SIZE_MAP.STEEL;

  bulletLoop: for (const bullet of bullets.values()) {
    const col1 = Math.floor(bullet.x / itemSize);
    const col2 = Math.floor((bullet.x + BULLET_SIZE) / itemSize);
    const row1 = Math.floor(bullet.y / itemSize);
    const row2 = Math.floor((bullet.y + BULLET_SIZE) / itemSize);
    for (let row = row1; row <= row2; row += 1) {
      for (let col = col1; col <= col2; col += 1) {
        const t = row * N + col;
        if (steels.get(t)) {
          context.expBulletOwners.add(bullet.owner);
          continue bulletLoop;
        }
      }
    }
  }
}

function* filterBulletsCollidedWithEagle(bullets) {
  const eagle = yield select(selectors.map.eagle);
  const eagleBox = {
    x: eagle.get('x'),
    y: eagle.get('y'),
    width: BLOCK_SIZE,
    height: BLOCK_SIZE
  };
  return bullets.filter(bullet =>
    testCollide(eagleBox, {
      x: bullet.x,
      y: bullet.y,
      width: BULLET_SIZE,
      height: BULLET_SIZE
    }));
}

const BULLET_EXPLOSION_SPREAD = 4;
function spreadBullet(bullet) {
  const object = { x: bullet.x, y: bullet.y, width: BULLET_SIZE, height: BULLET_SIZE };
  if (bullet.direction === UP || bullet.direction === DOWN) {
    object.x -= BULLET_EXPLOSION_SPREAD;
    object.width += 2 * BULLET_EXPLOSION_SPREAD;
  } else {
    object.y -= BULLET_EXPLOSION_SPREAD;
    object.height += 2 * BULLET_EXPLOSION_SPREAD;
  }
  return object;
}

// TODO, remove duplicated codes
function* destroySteels(collidedBullets) {
  const steels = yield select(selectors.map.steels);
  const steelsNeedToDestroy = [];
  const itemSize = ITEM_SIZE_MAP.STEEL;
  const N = N_MAP.STEEL;

  collidedBullets.forEach((bullet) => {
    // TODO, if (bullet.power >= 3)
    const { x, y, width, height } = spreadBullet(bullet);

    const col1 = Math.floor(x / itemSize);
    const col2 = Math.floor((x + width) / itemSize);
    const row1 = Math.floor(y / itemSize);
    const row2 = Math.floor((y + height) / itemSize);
    for (let row = row1; row <= row2; row += 1) {
      for (let col = col1; col <= col2; col += 1) {
        const t = row * N + col;
        if (steels.get(t)) {
          steelsNeedToDestroy.push(t);
        }
      }
    }
  });

  if (steelsNeedToDestroy.length > 0) {
    yield put({
      type: A.DESTROY_STEELS,
      ts: ISet(steelsNeedToDestroy)
    });
  }
}

function* destroyBricks(collidedBullets) {
  const bricks = yield select(selectors.map.bricks);
  const bricksNeedToDestroy = [];
  const itemSize = ITEM_SIZE_MAP.BRICK;
  const N = N_MAP.BRICK;

  collidedBullets.forEach((bullet) => {
    const { x, y, width, height } = spreadBullet(bullet);

    const col1 = Math.floor(x / itemSize);
    const col2 = Math.floor((x + width) / itemSize);
    const row1 = Math.floor(y / itemSize);
    const row2 = Math.floor((y + height) / itemSize);
    for (let row = row1; row <= row2; row += 1) {
      for (let col = col1; col <= col2; col += 1) {
        const t = row * N + col;
        if (bricks.get(t)) {
          bricksNeedToDestroy.push(t);
        }
      }
    }
  });

  if (bricksNeedToDestroy.length > 0) {
    yield put({
      type: A.DESTROY_BRICKS,
      ts: ISet(bricksNeedToDestroy)
    });
  }
}

function* handleBulletsCollidedWithTanks(context) {
  const bullets = yield select(selectors.bullets);

  const tanks = yield select(selectors.tanks);
  for (const bullet of bullets.values()) {
    const object = {
      x: bullet.x,
      y: bullet.y,
      width: BULLET_SIZE,
      height: BULLET_SIZE
    };
    for (const tank of tanks.values()) {
      const subject = {
        x: tank.x,
        y: tank.y,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE
      };
      if (testCollide(subject, object, -0.02)) {
        if (bullet.side === SIDE.PLAYER && tank.side === SIDE.PLAYER) {
          context.expBulletOwners.add(bullet.owner);
        } else if (bullet.side === SIDE.PLAYER && tank.side === SIDE.AI) {
          context.hurtedTankIds.add(tank.tankId);
          context.expBulletOwners.add(bullet.owner);
        } else if (bullet.side === SIDE.AI && tank.side === SIDE.PLAYER) {
          context.hurtedTankIds.add(tank.tankId);
          context.expBulletOwners.add(bullet.owner);
        } else if (bullet.side === SIDE.AI && tank.side === SIDE.AI) {
          context.noExpBulletOwners.add(bullet.owner);
        } else {
          throw new Error('Error side status');
        }
      }
    }
  }
}

function* handleBulletsCollidedWithBullets(context) {
  const bullets = yield select(selectors.bullets);
  for (const bullet of bullets.values()) {
    const subject = {
      x: bullet.x,
      y: bullet.y,
      width: BULLET_SIZE,
      height: BULLET_SIZE
    };
    for (const other of bullets.values()) {
      if (is(bullet, other)) {
        continue;
      }
      const object = {
        x: other.x,
        y: other.y,
        width: BULLET_SIZE,
        height: BULLET_SIZE
      };
      if (testCollide(subject, object)) {
        context.noExpBulletOwners.add(bullet.owner);
      }
    }
  }
}

function* handleAfterTick() {
  while (true) {
    yield take(A.AFTER_TICK);
    const bullets = yield select(selectors.bullets);

    const bulletsCollidedWithEagle = yield* filterBulletsCollidedWithEagle(bullets);
    if (!bulletsCollidedWithEagle.isEmpty()) {
      yield put({
        type: A.DESTROY_BULLETS,
        bullets: bulletsCollidedWithEagle,
        spawnExplosion: true
      });
      yield put({ type: A.DESTROY_EAGLE });
      return;
    }

    const context = {
      expBulletOwners: new Set(),
      noExpBulletOwners: new Set(),
      hurtedTankIds: new Set()
    };

    yield* handleBulletsCollidedWithTanks(context);
    yield* handleBulletsCollidedWithBullets(context);
    yield* handleBulletsCollidedWithBricks(context);
    yield* handleBulletsCollidedWithSteels(context);

    const expBullets = bullets.filter(bullet => context.expBulletOwners.has(bullet.owner));
    if (!expBullets.isEmpty()) {
      yield put({
        type: A.DESTROY_BULLETS,
        bullets: expBullets,
        spawnExplosion: true
      });

      yield* destroyBricks(expBullets);
      yield* destroySteels(expBullets);
    }

    const noExpBullets = bullets.filter(bullet => context.noExpBulletOwners.has(bullet.owner));
    if (context.noExpBulletOwners.size > 0) {
      yield put({
        type: A.DESTROY_BULLETS,
        bullets: noExpBullets,
        spawnExplosion: false
      });
    }

    const outsideBullets = bullets.filterNot(isBulletInField);
    if (!outsideBullets.isEmpty()) {
      yield put({
        type: A.DESTROY_BULLETS,
        bullets: outsideBullets,
        spawnExplosion: true
      });
    }
  }
}

let nextExplosionId = 1;

export default function* bulletsSaga() {
  yield fork(handleTick);
  yield fork(handleAfterTick);

  yield fork(function* handleDestroyBullets() {
    while (true) {
      const { bullets, spawnExplosion } = yield take(A.DESTROY_BULLETS);
      if (spawnExplosion) {
        yield* bullets.toArray().map(makeExplosionFromBullet);
      }
    }
  });
}
