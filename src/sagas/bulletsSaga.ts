import { Map as IMap, Set as ISet } from 'immutable';
import { fork, put, select, take, PutEffect } from 'redux-saga/effects';
import { BLOCK_SIZE, ITEM_SIZE_MAP, N_MAP, STEEL_POWER } from 'utils/consts';
import { asBox, getDirectionInfo, getNextId, isInField, iterRowsAndCols, testCollide } from 'utils/common';

import { BulletRecord, BulletsMap, State, TankRecord } from 'types';

type HurtCount = number;
type TargetTankId = TankId;
type SourceTankId = TankId;

type Context = {
  expBulletIdSet: Set<BulletId>;
  noExpBulletIdSet: Set<BulletId>;
  tankHurtMap: Map<TargetTankId, Map<SourceTankId, HurtCount>>;
};

function isBulletInField(bullet: BulletRecord) {
  return isInField(asBox(bullet));
}

function getOrDefault<K, V>(map: Map<K, V>, key: K, getValue: () => V) {
  if (!map.has(key)) {
    map.set(key, getValue());
  }
  return map.get(key);
}

function makeExplosionFromBullet(bullet: BulletRecord): PutEffect<Action> {
  return put({
    type: 'SPAWN_EXPLOSION',
    x: bullet.x - 6,
    y: bullet.y - 6,
    explosionType: 'bullet',
    explosionId: getNextId('explosion')
  } as Action.SpawnExplosionAction);
}

function makeExplosionFromTank(tank: TankRecord): PutEffect<Action> {
  return put({
    type: 'SPAWN_EXPLOSION',
    x: tank.x - 6,
    y: tank.y - 6,
    explosionType: 'tank',
    explosionId: getNextId('explosion')
  } as Action.SpawnExplosionAction);
}

function* handleTick() {
  while (true) {
    const { delta }: Action.TickAction = yield take('TICK');
    const { bullets }: State = yield select();
    if (bullets.isEmpty()) {
      continue;
    }
    const updatedBullets = bullets.map(bullet => {
      const { direction, speed } = bullet;
      const distance = speed * delta;
      const { xy, updater } = getDirectionInfo(direction);
      return bullet.update(xy, updater(distance));
    });
    yield put({ type: 'UPDATE_BULLETS', updatedBullets });
  }
}

function* handleBulletsCollidedWithBricks(context: Context) {
  const {
    bullets,
    map: { bricks }
  }: State = yield select();

  bullets.forEach(bullet => {
    for (const [row, col] of iterRowsAndCols(ITEM_SIZE_MAP.BRICK, asBox(bullet))) {
      const t = row * N_MAP.BRICK + col;
      if (bricks.get(t)) {
        context.expBulletIdSet.add(bullet.bulletId);
        return;
      }
    }
  });
}

function* handleBulletsCollidedWithSteels(context: Context) {
  const {
    bullets,
    map: { steels }
  }: State = yield select();

  bullets.forEach(bullet => {
    for (const [row, col] of iterRowsAndCols(ITEM_SIZE_MAP.STEEL, asBox(bullet))) {
      const t = row * N_MAP.STEEL + col;
      if (steels.get(t)) {
        context.expBulletIdSet.add(bullet.bulletId);
        return;
      }
    }
  });
}

const BULLET_EXPLOSION_SPREAD = 4;
function spreadBullet(bullet: BulletRecord) {
  const object = asBox(bullet);

  if (bullet.direction === 'up' || bullet.direction === 'down') {
    object.x -= BULLET_EXPLOSION_SPREAD;
    object.width += 2 * BULLET_EXPLOSION_SPREAD;
  } else {
    object.y -= BULLET_EXPLOSION_SPREAD;
    object.height += 2 * BULLET_EXPLOSION_SPREAD;
  }
  return object;
}

function* destroySteels(collidedBullets: BulletsMap) {
  const {
    map: { steels }
  }: State = yield select();
  const steelsNeedToDestroy: SteelIndex[] = [];

  collidedBullets.forEach(bullet => {
    if (bullet.power >= STEEL_POWER) {
      for (const [row, col] of iterRowsAndCols(ITEM_SIZE_MAP.STEEL, spreadBullet(bullet))) {
        const t = row * N_MAP.STEEL + col;
        if (steels.get(t)) {
          steelsNeedToDestroy.push(t);
        }
      }
    }
  });

  if (steelsNeedToDestroy.length > 0) {
    yield put({
      type: 'DESTROY_STEELS',
      ts: ISet(steelsNeedToDestroy)
    });
  }
}

function* destroyBricks(collidedBullets: BulletsMap) {
  const {
    map: { bricks }
  }: State = yield select();
  const bricksNeedToDestroy: BrickIndex[] = [];

  collidedBullets.forEach(bullet => {
    for (const [row, col] of iterRowsAndCols(ITEM_SIZE_MAP.BRICK, spreadBullet(bullet))) {
      const t = row * N_MAP.BRICK + col;
      if (bricks.get(t)) {
        bricksNeedToDestroy.push(t);
      }
    }
  });

  if (bricksNeedToDestroy.length > 0) {
    yield put({
      type: 'DESTROY_BRICKS',
      ts: ISet(bricksNeedToDestroy)
    });
  }
}

function* destroyTanks(tankIdSet: ISet<TankId>) {
  const { tanks }: State = yield select();
  yield* tankIdSet.map(tankId =>
    put({
      type: 'REMOVE_TANK',
      tankId
    })
  );
  yield* tankIdSet.map(tankId => tanks.get(tankId)).map(makeExplosionFromTank);
}

function* filterBulletsCollidedWithEagle(bullets: BulletsMap) {
  const {
    map: {
      eagle: { broken, x, y }
    }
  }: State = yield select();

  if (broken) {
    return IMap();
  } else {
    const eagleBox = {
      x,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE
    };
    return bullets.filter(bullet => testCollide(eagleBox, asBox(bullet)));
  }
}

function* handleBulletsCollidedWithTanks(context: Context) {
  const { bullets, tanks }: State = yield select();

  for (const bullet of bullets.values()) {
    for (const tank of tanks.values()) {
      if (tank.tankId === bullet.tankId) {
        continue;
      }
      const subject = {
        x: tank.x,
        y: tank.y,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE
      };
      if (testCollide(subject, asBox(bullet), -0.02)) {
        const bulletSide = tanks.find(t => t.tankId === bullet.tankId).side;
        const tankSide = tank.side;
        if (bulletSide === 'player' && tankSide === 'player') {
          context.expBulletIdSet.add(bullet.bulletId);
        } else if (bulletSide === 'player' && tankSide === 'ai') {
          const hurtSubMap = getOrDefault(context.tankHurtMap, tank.tankId, () => new Map());
          const oldHurt = hurtSubMap.get(tank.tankId) || 0;
          hurtSubMap.set(bullet.tankId, oldHurt + 1);
          context.expBulletIdSet.add(bullet.bulletId);
        } else if (bulletSide === 'ai' && tankSide === 'player') {
          const hurtSubMap = getOrDefault(context.tankHurtMap, tank.tankId, () => new Map());
          const oldHurt = hurtSubMap.get(tank.tankId) || 0;
          hurtSubMap.set(bullet.tankId, oldHurt + 1);
          context.expBulletIdSet.add(bullet.bulletId);
        } else if (bulletSide === 'ai' && tankSide === 'ai') {
          context.noExpBulletIdSet.add(bullet.bulletId);
        } else {
          throw new Error('Error side status');
        }
      }
    }
  }
}

function* handleBulletsCollidedWithBullets(context: Context) {
  const { bullets }: State = yield select();
  for (const bullet of bullets.values()) {
    const subject = asBox(bullet);
    for (const other of bullets.values()) {
      if (bullet.bulletId === other.bulletId) {
        continue;
      }
      const object = asBox(other);
      if (testCollide(subject, object)) {
        context.noExpBulletIdSet.add(bullet.bulletId);
      }
    }
  }
}

function* handleAfterTick() {
  while (true) {
    yield take('AFTER_TICK');
    const { bullets, players, tanks }: State = yield select();

    const bulletsCollidedWithEagle = yield* filterBulletsCollidedWithEagle(bullets);
    if (!bulletsCollidedWithEagle.isEmpty()) {
      yield put({
        type: 'DESTROY_BULLETS',
        bullets: bulletsCollidedWithEagle,
        spawnExplosion: true
      });
      yield put({ type: 'DESTROY_EAGLE' });
    }

    const context = {
      expBulletIdSet: new Set(),
      noExpBulletIdSet: new Set(),
      tankHurtMap: new Map()
    };

    yield* handleBulletsCollidedWithTanks(context);
    yield* handleBulletsCollidedWithBullets(context);
    yield* handleBulletsCollidedWithBricks(context);
    yield* handleBulletsCollidedWithSteels(context);

    const expBullets = bullets.filter(bullet => context.expBulletIdSet.has(bullet.bulletId));
    if (!expBullets.isEmpty()) {
      yield put({
        type: 'DESTROY_BULLETS',
        bullets: expBullets,
        spawnExplosion: true
      });

      yield* destroyBricks(expBullets);
      yield* destroySteels(expBullets);
    }

    const kills: PutEffect<Action.KillAction>[] = [];
    for (const [targetTankId, hurtMap] of context.tankHurtMap.entries()) {
      const sourceTankId = hurtMap.keys().next().value;
      kills.push(
        put<Action.KillAction>({
          type: 'KILL',
          targetTank: tanks.get(targetTankId),
          sourceTank: tanks.get(sourceTankId),
          targetPlayer: players.find(ply => ply.tankId === targetTankId),
          sourcePlayer: players.find(ply => ply.tankId === sourceTankId)
        })
      );
    }
    if (context.tankHurtMap.size > 0) {
      yield destroyTanks(ISet(context.tankHurtMap.keys()));
    }

    yield* kills;

    const noExpBullets = bullets.filter(bullet => context.noExpBulletIdSet.has(bullet.bulletId));
    if (context.noExpBulletIdSet.size > 0) {
      yield put({
        type: 'DESTROY_BULLETS',
        bullets: noExpBullets,
        spawnExplosion: false
      });
    }

    const outsideBullets = bullets.filterNot(isBulletInField);
    if (!outsideBullets.isEmpty()) {
      yield put({
        type: 'DESTROY_BULLETS',
        bullets: outsideBullets,
        spawnExplosion: true
      });
    }
  }
}

export default function* bulletsSaga() {
  yield fork(handleTick);
  yield fork(handleAfterTick);

  yield fork(function* handleDestroyBullets() {
    while (true) {
      const { bullets, spawnExplosion } = yield take('DESTROY_BULLETS');
      if (spawnExplosion) {
        yield* bullets.toArray().map(makeExplosionFromBullet);
      }
    }
  });
}
