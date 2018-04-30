import { delay } from 'redux-saga';
import { put, fork } from 'redux-saga/effects';
import * as A from 'utils/actions';
import { UP, BLOCK_SIZE, TANK_SPAWN_DELAY } from 'utils/consts';

let nextFlickerId = 1;

function* spawnPlayer() {
  yield put({
    type: A.SPAWN_FLICKER,
    flickerId: nextFlickerId++,
    x: 4 * BLOCK_SIZE,
    y: 12 * BLOCK_SIZE
  });
  yield delay(TANK_SPAWN_DELAY);
  yield put({
    type: A.SPAWN_PLAYER,
    x: 4 * BLOCK_SIZE,
    y: 12 * BLOCK_SIZE,
    direction: UP
  });
}

export default function* gameManager() {
  yield put({ type: A.LOAD_STAGE, name: 'test' });

  yield fork(spawnPlayer);
  // TODO ui
}
