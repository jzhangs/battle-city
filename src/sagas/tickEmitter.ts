import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

const tickChannel = eventChannel<Action>(emit => {
  let lastTime = Date.now();
  let requestId = requestAnimationFrame(emitTick);

  function emitTick() {
    const now = Date.now();
    emit({ type: 'TICK', delta: now - lastTime });
    emit({ type: 'AFTER_TICK', delta: now - lastTime });
    lastTime = now;
    requestId = requestAnimationFrame(emitTick);
  }

  return () => {
    cancelAnimationFrame(requestId);
  };
});

export default function* tickEmitter() {
  while (true) {
    yield put(yield take(tickChannel));
  }
}
