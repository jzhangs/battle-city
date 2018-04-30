import { eventChannel } from 'redux-saga';
import { fork, take, put } from 'redux-saga/effects';

import fireController from 'sagas/fireController';
import directionController from 'sagas/directionController';
import bulletsSaga from 'sagas/bulletsSaga';
import gameManager from 'sagas/gameManager';
import * as A from 'utils/actions';

const tickChannel = eventChannel((emit) => {
  let lastTime = Date.now();
  let requestId = requestAnimationFrame(emitTick);

  function emitTick() {
    const now = Date.now();
    emit({ type: A.TICK, delta: now - lastTime });
    emit({ type: A.AFTER_TICK, delta: now - lastTime });
    lastTime = now;
    requestId = requestAnimationFrame(emitTick);
  }

  return () => {
    cancelAnimationFrame(requestId);
  };
});

function* handleTick() {
  while (true) {
    yield put(yield take(tickChannel));
  }
}

export default function* rootSaga() {
  console.info('root saga started');
  yield fork(bulletsSaga);

  yield fork(directionController);
  yield fork(fireController);

  yield fork(handleTick);

  yield fork(gameManager);
}
