import { delay } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { BLOCK_SIZE } from 'utils/consts';
import { getNextId } from 'utils/common';
import stageSaga from 'sagas/stageSaga';
import stageConfigs from 'stages';

type Animation = {
  direction: Direction;
  distance: number;
  duration: number;
};

function* animateTexts(textIds: TextId[], { direction, distance: totalDistance, duration }: Animation) {
  const speed = totalDistance / duration;
  let animatedDistance = 0;
  while (true) {
    const { delta } = yield take('TICK');
    const len = delta * speed;
    const distance = len + animatedDistance < totalDistance ? len : totalDistance - animatedDistance;
    yield put({
      type: 'UPDATE_TEXT_POSITION',
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
    type: 'SET_TEXT',
    textId: textId1,
    content: 'game',
    fill: 'red',
    x: BLOCK_SIZE * 6.5,
    y: BLOCK_SIZE * 13
  });
  yield put({
    type: 'SET_TEXT',
    textId: textId2,
    content: 'over',
    fill: 'red',
    x: BLOCK_SIZE * 6.5,
    y: BLOCK_SIZE * 13.5
  });
  yield* animateTexts([textId1, textId2], {
    direction: 'up',
    distance: BLOCK_SIZE * 6,
    duration: 1000
  });
  yield delay(500);
  yield put<Action>({ type: 'REMOVE_TEXT', textId: textId1 });
  yield put<Action>({ type: 'REMOVE_TEXT', textId: textId2 });
  yield put<Action>({ type: 'LOAD_SCENE', scene: 'gameover' });
}

interface StageResult {
  status: 'clear' | 'fail';
  reason?: string;
}

export default function* gameManager() {
  yield take((action: Action) => action.type === 'GAMESTART');
  console.log('gamestart');

  const stages = Object.keys(stageConfigs);
  for (const stageName of stages) {
    const stageResult: StageResult = yield* stageSaga(stageName);
    if (stageResult.status === 'clear') {
      // continue to next stage
    } else {
      console.log(`gameover, reason: ${stageResult.reason}`);
      yield* animateGameover();
    }
  }
}
