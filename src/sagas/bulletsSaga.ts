import { Map as IMap, Set as ISet } from 'immutable';
import { fork, put, select, take } from 'redux-saga/effects';
import { BLOCK_SIZE, ITEM_SIZE_MAP, N_MAP, STEEL_POWER } from 'utils/consts';
import { destroyBullets, destroyTanks } from 'sagas/common';
import { BulletRecord, BulletsMap, State } from 'types';
import { asBox, getDirectionInfo, getOrDefault, isInField, iterRowsAndCols, sum, testCollide } from 'utils/common';

type HurtCount = number;
type TargetTankId = TankId;
type SourceTankId = TankId;

interface Context {
  readonly expBulletIdSet: Set<BulletId>;
  readonly noExpBulletIdSet: Set<BulletId>;
  readonly tankHurtMap: Map<TargetTankId, Map<SourceTankId, HurtCount>>;
  readonly frozenTankIdSet: Set<TankId>;
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
      type: 'REMOVE_STEELS',
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
      type: 'REMOVE_BRICKS',
      ts: ISet(bricksNeedToDestroy)
    });
  }
}

function* filterBulletsCollidedWithEagle(bullets: BulletsMap) {
  const {
    map: { eagle }
  }: State = yield select();
  if (eagle == null) {
    return bullets.clear();
  }
  const { broken, x, y } = eagle;

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
  const { bullets, tanks: allTanks }: State = yield select();
  const activeTanks = allTanks.filter(t => t.active);

  for (const bullet of bullets.values()) {
    for (const tank of activeTanks.values()) {
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
        const bulletSide = allTanks.find(t => t.tankId === bullet.tankId).side;
        const tankSide = tank.side;
        if (bulletSide === 'player' && tankSide === 'player') {
          context.expBulletIdSet.add(bullet.bulletId);
          context.frozenTankIdSet.add(tank.tankId);
        } else if (bulletSide === 'player' && tankSide === 'ai') {
          const hurtSubMap = getOrDefault(context.tankHurtMap, tank.tankId, () => new Map());
          const oldHurt = hurtSubMap.get(tank.tankId) || 0;
          hurtSubMap.set(bullet.tankId, oldHurt + 1);
          context.expBulletIdSet.add(bullet.bulletId);
        } else if (bulletSide === 'ai' && tankSide === 'player') {
          if (tank.helmetDuration > 0) {
            context.noExpBulletIdSet.add(bullet.bulletId);
          } else {
            const hurtSubMap = getOrDefault(context.tankHurtMap, tank.tankId, () => new Map());
            const oldHurt = hurtSubMap.get(tank.tankId) || 0;
            hurtSubMap.set(bullet.tankId, oldHurt + 1);
            context.expBulletIdSet.add(bullet.bulletId);
          }
        } else if (bulletSide === 'ai' && tankSide === 'ai') {
          // context.noExpBulletIdSet.add(bullet.bulletId);
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

function calculateHurtsAndKillsFromContext({ tanks, players }: State, context: Context) {
  const kills: Action.KillAction[] = [];
  const hurts: Action.HurtAction[] = [];

  for (const [targetTankId, hurtMap] of context.tankHurtMap.entries()) {
    const hurt = sum(hurtMap.values());
    const targetTank = tanks.get(targetTankId);
    if (hurt >= targetTank.hp) {
      const sourceTankId = hurtMap.keys().next().value;
      kills.push({
        type: 'KILL',
        targetTank,
        sourceTank: tanks.get(sourceTankId),
        targetPlayer: players.find(p => p.activeTankId === targetTankId),
        sourcePlayer: players.find(p => p.activeTankId === sourceTankId)
      });
    } else {
      hurts.push({
        type: 'HURT',
        targetTank,
        hurt
      });
    }
  }
  return { kills, hurts };
}

function* handleAfterTick() {
  while (true) {
    yield take('AFTER_TICK');
    const state: State = yield select();
    const { bullets } = state;

    const bulletsCollidedWithEagle = yield* filterBulletsCollidedWithEagle(bullets);
    if (!bulletsCollidedWithEagle.isEmpty()) {
      yield fork(destroyBullets, bulletsCollidedWithEagle, true);
      yield put({ type: 'DESTROY_EAGLE' });
    }

    const context = {
      expBulletIdSet: new Set(),
      noExpBulletIdSet: new Set(),
      tankHurtMap: new Map(),
      frozenTankIdSet: new Set()
    };

    yield* handleBulletsCollidedWithTanks(context);
    yield* handleBulletsCollidedWithBullets(context);
    yield* handleBulletsCollidedWithBricks(context);
    yield* handleBulletsCollidedWithSteels(context);

    const expBullets = bullets.filter(bullet => context.expBulletIdSet.has(bullet.bulletId));
    if (!expBullets.isEmpty()) {
      yield fork(destroyBullets, expBullets, true);
      yield* destroyBricks(expBullets);
      yield* destroySteels(expBullets);
    }

    for (const tankId of context.frozenTankIdSet) {
      yield put<Action.SetFrozenTimeoutAction>({
        type: 'SET_FROZEN_TIMEOUT',
        tankId,
        frozenTimeout: 500
      });
    }

    const { kills, hurts } = calculateHurtsAndKillsFromContext(state, context);

    yield* hurts.map(hurtAction => put(hurtAction));
    yield* kills.map(killAction => put(killAction));
    yield fork(destroyTanks, IMap(kills.map(kill => [kill.targetTank.tankId, kill.targetTank])));

    const noExpBullets = bullets.filter(bullet => context.noExpBulletIdSet.has(bullet.bulletId));
    yield fork(destroyBullets, noExpBullets, false);

    const outsideBullets = bullets.filterNot(bullet => isInField(asBox(bullet)))
    yield fork(destroyBullets, outsideBullets, true);
  }
}

export default function* bulletsSaga() {
  yield fork(handleTick);
  yield fork(handleAfterTick);
}
