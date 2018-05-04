import { put, fork, select, take } from 'redux-saga/effects';
import { BLOCK_SIZE } from 'utils/consts';
import { spawnTank, testCollide, asBox } from 'utils/common';
import * as selectors from 'utils/selectors';
import { State } from 'reducers';
import { TankRecord, PlayerRecord } from 'types';

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
    yield take(
      (action: Action) =>
        action.type === 'LOAD_STAGE' || (action.type === 'KILL' && action.targetPlayer.playerName === playerName)
    );
    const { players }: State = yield select();
    const player = players.get(playerName);
    if (player.lives > 0) {
      yield put({ type: 'DECREMENT_PLAYER_LIVE', playerName });
      const tankId = yield* spawnTank(
        TankRecord({
          x: 4 * BLOCK_SIZE,
          y: 12 * BLOCK_SIZE,
          side: 'player',
          color: tankColor,
          level: 'basic',
          bulletSpeed: 0.2,
          bulletInterval: 100,
          bulletLimit: Infinity
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
