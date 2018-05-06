import { delay } from 'redux-saga';
import { all, put } from 'redux-saga/effects';
import { BulletRecord, BulletsMap, ExplosionRecord } from 'types';
import { frame as f, getNextId } from 'utils/common';

function* explosionFromBullet(bullet: BulletRecord) {
  const bulletExplosionShapeTiming: [ExplosionShape, number][] = [['s0', f(4)], ['s1', f(3)], ['s2', f(2)]];

  const explosionId = getNextId('explosion');
  for (const [shape, time] of bulletExplosionShapeTiming) {
    yield put<Action.AddOrUpdateExplosion>({
      type: 'ADD_OR_UPDATE_EXPLOSION',
      explosion: ExplosionRecord({
        cx: bullet.x + 2,
        cy: bullet.y + 2,
        shape,
        explosionId
      })
    });
    yield delay(time);
  }

  yield put<Action.RemoveExplosionAction>({
    type: 'REMOVE_EXPLOSION',
    explosionId
  });
}

function* destroyBullet(bullet: BulletRecord, useExplosion: boolean) {
  yield put<Action.RemoveBulletAction>({
    type: 'REMOVE_BULLET',
    bulletId: bullet.bulletId
  });
  if (useExplosion) {
    yield* explosionFromBullet(bullet);
  }
}

export default function* destroyBullets(bullets: BulletsMap, useExplosion: boolean) {
  if (!bullets.isEmpty()) {
    yield all(bullets.toArray().map(bullet => destroyBullet(bullet, useExplosion)));
  }
}
