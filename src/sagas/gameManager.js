import { delay } from 'redux-saga';
import { put, fork, take, call } from 'redux-saga/effects';
import * as A from 'utils/actions';
import { UP, TANK_SPAWN_DELAY, SIDE, BLOCK_SIZE } from 'utils/consts';
import { getNextId } from 'utils/common';

function* spawnTank({ x, y, side }) {
  yield put({
    type: A.SPAWN_FLICKER,
    flickerId: getNextId('flicker'),
    x,
    y
  });
  yield delay(TANK_SPAWN_DELAY);
  const tankId = getNextId('tank');
  yield put({
    type: A.SPAWN_TANK,
    side,
    tankId,
    x,
    y,
    direction: UP
  });
  return tankId;
}

function* animateTexts(textIds, { direction, distance: totalDistance, duration }) {
  const speed = totalDistance / duration;
  let animatedDistance = 0;
  while (true) {
    const { delta } = yield take(A.TICK);
    const len = delta * speed;
    const distance =
      len + animatedDistance < totalDistance ? len : totalDistance - animatedDistance;
    yield put({
      type: A.UPDATE_TEXT_POSITION,
      textIds,
      direction,
      distance
    });
    animatedDistance += distance;
    if (animatedDistance >= totalDistance) {
      return;
    }
  }
}

function* animateGameover() {
  const textId1 = getNextId('text');
  const textId2 = getNextId('text');
  yield put({
    type: A.SET_TEXT,
    textId: textId1,
    content: 'game',
    fill: 'red',
    x: BLOCK_SIZE * 6.5,
    y: BLOCK_SIZE * 13
  });
  yield put({
    type: A.SET_TEXT,
    textId: textId2,
    content: 'over',
    fill: 'red',
    x: BLOCK_SIZE * 6.5,
    y: BLOCK_SIZE * 13.5
  });
  yield* animateTexts([textId1, textId2], {
    direction: UP,
    distance: BLOCK_SIZE * 6,
    duration: 1000
  });
  yield delay(500);
  yield put({ type: A.REMOVE_TEXT, textId: textId1 });
  yield put({ type: A.REMOVE_TEXT, textId: textId2 });
  yield put({ type: A.SHOW_OVERLAY, overlay: 'gameover' });
}

function* watchGameover() {
  while (true) {
    yield take([A.DESTROY_EAGLE]);
    yield put({ type: A.DEACTIVATE_ALL_PLAYERS });
    yield* animateGameover();
  }
}

export default function* gameManager() {
  yield fork(watchGameover);

  yield put({ type: A.LOAD_STAGE, name: 'test' });

  yield put({
    type: A.CREATE_PLAYER,
    playerName: 'player-1',
    lives: 3
  });

  yield put({
    type: A.CREATE_PLAYER,
    playerName: 'AI',
    lives: 3
  });

  const [tankId1, tankId2] = yield [
    call(spawnTank, { x: 4 * BLOCK_SIZE, y: 12 * BLOCK_SIZE, side: SIDE.PLAYER }),
    call(spawnTank, { x: 0, y: 0, side: SIDE.AI })
  ];

  yield put({
    type: A.ACTIVATE_PLAYER,
    playerName: 'player-1',
    tankId: tankId1
  });

  yield put({
    type: A.ACTIVATE_PLAYER,
    playerName: 'AI',
    tankId: tankId2
  });
}
