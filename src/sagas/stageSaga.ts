import { Map } from 'immutable';
import * as _ from 'lodash';
import { delay, Effect } from 'redux-saga';
import { fork, put, race, select, take } from 'redux-saga/effects';
import { State } from 'reducers';
import { PowerUpRecord } from 'types';
import { getNextId, frame as f } from 'utils/common';
import * as selectors from 'utils/selectors';

// const log = console.log;

const tankLevels: TankLevel[] = ['basic', 'fast', 'power', 'armor'];

function* statistics() {
  yield put<Action>({ type: 'LOAD_SCENE', scene: 'statistics' });

  const {
    game: { killInfo }
  }: State = yield select();

  const player1KillInfo = killInfo.get('player-1', Map<TankLevel, KillCount>());

  yield delay(500);

  for (const tankLevel of tankLevels) {
    const {
      game: { transientKillInfo }
    }: State = yield select();

    yield delay(250);
    const levelKillCount = player1KillInfo.get(tankLevel, 0);
    if (levelKillCount === 0) {
      yield put<Action>({
        type: 'UPDATE_TRANSIENT_KILL_INFO',
        info: transientKillInfo.setIn(['player-1', tankLevel], 0)
      });
    } else {
      for (let count = 1; count <= levelKillCount; count += 1) {
        yield put<Action>({
          type: 'UPDATE_TRANSIENT_KILL_INFO',
          info: transientKillInfo.setIn(['player-1', tankLevel], count)
        });
        yield delay(160);
      }
    }
    yield delay(200);
  }
  yield delay(200);
  yield put<Action>({ type: 'SHOW_TOTAL_KILL_COUNT' });
  yield delay(1000);
}

function* powerUp(powerUp: PowerUpRecord) {
  const pickThisPowerUp = (action: Action) =>
    action.type === 'PICK_POWER_UP' && action.powerUp.powerUpId === powerUp.powerUpId;
  try {
    yield put<Action>({
      type: 'ADD_POWER_UP',
      powerUp
    });
    let visible = true;
    for (let i = 0; i < 50; i++) {
      const result = yield race({
        timeout: delay(f(8)),
        picked: take(pickThisPowerUp),
        stageChanged: take('START_STAGE')
      });
      if (result.picked || result.stageChanged) {
        break;
      } // else timeout
      visible = !visible;
      yield put<Action>({
        type: 'UPDATE_POWER_UP',
        powerUp: powerUp.set('visible', visible)
      });
    }
  } finally {
    yield put<Action>({
      type: 'REMOVE_POWER_UP',
      powerUpId: powerUp.powerUpId
    });
  }
}

function* tween(duration: number, effectFactory: (t: number) => Effect) {
  let accumulation = 0;
  while (accumulation < duration) {
    const { delta }: Action.TickAction = yield take('TICK');
    accumulation += delta;
    yield effectFactory(_.clamp(accumulation / duration, 0, 1));
  }
}

export default function* stageSaga(stageName: string) {
  yield put<Action>({ type: 'LOAD_SCENE', scene: 'game' });

  yield put<Action>({
    type: 'UPDATE_CURTAIN',
    curtainName: 'stage-enter-curtain',
    t: 0
  });

  yield* tween(f(50), t =>
    put<Action>({
      type: 'UPDATE_CURTAIN',
      curtainName: 'stage-enter-curtain',
      t
    })
  );
  yield delay(f(20));
  yield put<Action>({
    type: 'LOAD_STAGE_MAP',
    name: stageName
  });
  yield delay(f(30));
  yield* tween(f(50), t =>
    put<Action>({
      type: 'UPDATE_CURTAIN',
      curtainName: 'stage-enter-curtain',
      t: 1 - t
    })
  );

  yield put<Action>({ type: 'START_STAGE', name: stageName });
  yield put<Action>({ type: 'SHOW_HUD' });

  while (true) {
    const { sourcePlayer, targetTank }: Action.KillAction = yield take('KILL');
    const {
      players,
      game: { remainingEnemies },
      tanks
    }: State = yield select();

    if (sourcePlayer.side === 'player') {
      yield put<Action>({
        type: 'INC_KILL_COUNT',
        playerName: sourcePlayer.playerName,
        level: targetTank.level
      });

      if (targetTank.withPowerUp) {
        const powerUpName = _.sample(['tank', 'star', 'grenade', 'timer', 'helmet', 'shovel'] as PowerUpName[]);
        const position = _.sample(yield select(selectors.validPowerUpSpawnPositions));
        yield fork(
          powerUp,
          PowerUpRecord({
            powerUpId: getNextId('power-up'),
            powerUpName,
            visible: true,
            x: position.x,
            y: position.y
          })
        );
      }

      const activeAITanks = tanks.filter(t => t.active && t.side === 'ai');

      if (remainingEnemies.isEmpty() && activeAITanks.isEmpty()) {
        yield delay(6000);
        yield* statistics();
        return { status: 'clear' };
      }
    } else {
      if (!players.some(ply => ply.side === 'player' && ply.lives > 0)) {
        yield delay(2000);
        yield* statistics();
        return { status: 'fail', reason: 'all-players-dead' };
      }
    }
  }
}
