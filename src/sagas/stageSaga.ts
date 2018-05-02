import { delay } from 'redux-saga';
import { put, select, take } from 'redux-saga/effects';
import { State } from 'reducers';

function* statistics() {
  yield put({ type: 'SHOW_OVERLAY', overlay: 'statistics' });
  yield delay(5000);
  yield put({ type: 'REMOVE_OVERLAY', overlay: 'statistics' });
}

export default function* stageSaga(stageName: string) {
  yield put<Action>({ type: 'LOAD_STAGE', name: stageName });

  while (true) {
    const { sourcePlayer, targetTank }: Action.KillAction = yield take('KILL');
    const {
      players,
      game: { remainingEnemyCount },
      tanks
    }: State = yield select();

    if (sourcePlayer.side === 'player') {
      yield put<Action>({
        type: 'INC_KILL_COUNT',
        playerName: sourcePlayer.playerName,
        level: targetTank.level
      });

      if (remainingEnemyCount === 0 && tanks.filter(t => t.side === 'ai').size === 0) {
        yield* statistics();
        return { status: 'clear' };
      }
    } else {
      if (!players.some(ply => ply.side === 'player' && ply.lives > 0)) {
        yield* statistics();
        return { status: 'fail', reason: 'all-players-dead' };
      }
    }
  }
}
