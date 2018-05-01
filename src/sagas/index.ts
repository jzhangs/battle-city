import { takeEvery, delay, eventChannel } from 'redux-saga';
import { fork, take, put } from 'redux-saga/effects';
import playerController from 'sagas/playerController';
import bulletsSaga from 'sagas/bulletsSaga';
import gameManager from 'sagas/gameManager';
import workerSaga from 'sagas/workerSaga';
import { CONTROL_CONFIG, TANK_SPAWN_DELAY } from 'utils/consts';
import * as A from 'utils/actions';

const tickChannel = eventChannel<Action>((emit) => {
  let lastTime = performance.now();
  let requestId = requestAnimationFrame(emitTick);

  function emitTick() {
    const now = performance.now();
    emit({ type: 'TICK', delta: now - lastTime });
    emit({ type: 'AFTER_TICK', delta: now - lastTime });
    lastTime = now;
    requestId = requestAnimationFrame(emitTick);
  }

  return () => {
    cancelAnimationFrame(requestId);
  };
});

function* autoRemoveEffects() {
  yield takeEvery('SPAWN_EXPLOSION', function* removeExplosion({ explosionId, explosionType }: Action.SpawnExplosionAction) {
    yield delay(explosionType === 'tank' ? 500 : 200);
    yield put({ type: 'REMOVE_EXPLOSION', explosionId })
  })
  yield takeEvery('SPAWN_FLICKER', function* removeFlicker({ flickerId }: Action.SpawnFlickerAction) {
    yield delay(TANK_SPAWN_DELAY)
    yield put({ type: 'REMOVE_FLICKER', flickerId })
  })
}

export default function* rootSaga() {
  yield fork(function* handleTick() {
    while (true) {
      yield put(yield take(tickChannel));
    }
  });

  yield fork(bulletsSaga);
  yield fork(autoRemoveEffects);

  yield fork(playerController, 'player-1', CONTROL_CONFIG.player1);
  yield fork(playerController, 'player-2', CONTROL_CONFIG.player2);

  yield fork(workerSaga);

  yield fork(gameManager);
}
