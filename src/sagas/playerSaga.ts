import { put, select, take } from 'redux-saga/effects';
import { BLOCK_SIZE } from 'utils/consts';
import { spawnTank } from 'utils/common';
import { State } from 'reducers';
import { TankRecord, PlayerRecord } from 'types';

export default function* playerSaga(playerName: string, tankColor: TankColor) {
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
          level: 'basic'
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
