import { eventChannel } from 'redux-saga';
import { fork, take, put } from 'redux-saga/effects';

import fireController from 'sagas/fireController';
import directionController from 'sagas/directionController';
import displacementSaga from 'sagas/displacementSaga';
import * as A from 'utils/actions';

const tickChannel = eventChannel((emit) => {
  let lastTime = Date.now();
  let requestId = requestAnimationFrame(emitTick);

  function emitTick() {
    const now = Date.now();
    emit({ type: A.TICK, delta: (now - lastTime) / 1000 });
    lastTime = now;
    requestId = requestAnimationFrame(emitTick);
  }

  return () => {
    cancelAnimationFrame(requestId);
  };
});

export default function* rootSaga() {
  console.info('root saga started');
  yield fork(directionController);
  yield fork(fireController);
  yield fork(displacementSaga);

  yield fork(function* handleTick() {
    while (true) {
      yield put(yield take(tickChannel));
    }
  });
}
