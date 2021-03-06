import { delay } from 'redux-saga';
import { all, put } from 'redux-saga/effects';
import { ExplosionRecord, ScoreRecord, TankRecord, TanksMap } from 'types';
import { frame as f, getNextId } from 'utils/common';
import { TANK_KILL_SCORE_MAP } from 'utils/consts';

function* scoreFromKillTank(tank: TankRecord) {
  const scoreId: ScoreId = getNextId('score');
  yield put<Action.AddScoreAction>({
    type: 'ADD_SCORE',
    score: ScoreRecord({
      score: TANK_KILL_SCORE_MAP[tank.level],
      scoreId,
      x: tank.x,
      y: tank.y
    })
  });
  yield delay(f(48));
  yield put<Action.RemoveScoreAction>({
    type: 'REMOVE_SCORE',
    scoreId
  });
}

function* explosionFromTank(tank: TankRecord) {
  const tankExplosionShapeTiming: Timing<ExplosionShape> = [
    ['s0', f(7)],
    ['s1', f(5)],
    ['s2', f(7)],
    ['b0', f(5)],
    ['b1', f(7)],
    ['s2', f(5)]
  ];

  const explosionId = getNextId('explosion');
  for (const [shape, time] of tankExplosionShapeTiming) {
    yield put<Action.AddOrUpdateExplosion>({
      type: 'ADD_OR_UPDATE_EXPLOSION',
      explosion: ExplosionRecord({
        cx: tank.x + 8,
        cy: tank.y + 8,
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

function* killTank(tank: TankRecord) {
  yield put({
    type: 'REMOVE_TANK',
    tankId: tank.tankId
  });

  yield* explosionFromTank(tank);
  if (tank.side === 'ai') {
    yield* scoreFromKillTank(tank);
  }
}

export default function* destroyTanks(tanks: TanksMap) {
  yield all(tanks.toArray().map(killTank));
}
