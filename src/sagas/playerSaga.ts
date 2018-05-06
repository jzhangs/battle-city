import { delay } from 'redux-saga';
import { put, fork, select, take } from 'redux-saga/effects';
import { BLOCK_SIZE } from 'utils/consts';
import { testCollide, asBox, frame as f } from 'utils/common';
import { spawnTank } from 'sagas/common';
import * as selectors from 'utils/selectors';
import { TankRecord, PlayerRecord, State } from 'types';

function* handlePickPowerUps(playerName: string) {
  while (true) {
    yield take('AFTER_TICK');
    const tank: TankRecord = yield select(selectors.playerTank, playerName);
    // console.assert(tank != null, 'tank is null in handlePickPowerUps')
    if (tank == null) {
      continue;
    }
    const { powerUps, players }: State = yield select();
    const powerUp = powerUps.find(p => testCollide(asBox(p, -0.5), asBox(tank)));
    if (powerUp) {
      yield put<Action>({
        type: 'PICK_POWER_UP',
        tank,
        powerUp,
        player: players.get(playerName)
      });
    }
  }
}

export default function* playerSaga(playerName: string, tankColor: TankColor) {
  yield fork(handlePickPowerUps, playerName);

  yield put({
    type: 'CREATE_PLAYER',
    player: PlayerRecord({
      playerName,
      lives: 3,
      side: 'player'
    })
  });

  while (true) {
    const action: Action = yield take(
      (action: Action) =>
        action.type === 'START_STAGE' || (action.type === 'KILL' && action.targetPlayer.playerName === playerName)
    );
    const { players }: State = yield select();
    const player = players.get(playerName);
    if (player.lives > 0) {
      if (action.type === 'KILL') {
        yield delay(500);
      }
      yield put<Action>({ type: 'DECREMENT_PLAYER_LIFE', playerName });
      const tankId = yield* spawnTank(
        TankRecord({
          x: 4 * BLOCK_SIZE,
          y: 12 * BLOCK_SIZE,
          side: 'player',
          color: tankColor,
          level: 'basic',
          helmetDuration: action.type === 'START_STAGE' ? f(135) : f(180)
        })
      );
      yield put({
        type: 'ACTIVATE_PLAYER',
        playerName,
        tankId
      });
    }
  }
}
