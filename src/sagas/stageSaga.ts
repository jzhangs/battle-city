import { Map } from 'immutable';
import { delay } from 'redux-saga';
import { put, select, take } from 'redux-saga/effects';
import { State } from 'reducers';

const tankLevels: TankLevel[] = ['basic', 'fast', 'power', 'armor'];

function* statistics() {
  yield put<Action>({ type: 'SHOW_OVERLAY', overlay: 'statistics' });

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
    yield delay(300);
  }
  yield put<Action>({ type: 'SHOW_TOTAL_KILL_COUNT' });
  yield delay(3000);

  yield put<Action>({ type: 'REMOVE_OVERLAY' });
}

export default function* stageSaga(stageName: string) {
  yield put<Action>({ type: 'LOAD_STAGE', name: stageName });

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

      if (remainingEnemies.isEmpty() && tanks.filter(t => t.side === 'ai').isEmpty()) {
        yield delay(6000);
        yield* statistics();
        return { status: 'clear' };
      }
    } else {
      if (!players.some(ply => ply.side === 'player' && ply.lives > 0)) {
        yield delay(6000);
        yield* statistics();
        return { status: 'fail', reason: 'all-players-dead' };
      }
    }
  }
}
