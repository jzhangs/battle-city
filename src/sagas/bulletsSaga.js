import { takeEvery, put, select } from 'redux-saga/effects';
import { UP, DOWN, LEFT, RIGHT, BULLET_SIZE, FIELD_BSIZE, BLOCK_SIZE } from 'utils/consts';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

function* update({ delta }) {
  const bullets = yield select(selectors.bullets);
  const newBullets = bullets.map((b) => {
    const { direction, speed, x, y } = b;
    if (direction === UP) {
      return b.set('y', y - speed * delta);
    } else if (direction === DOWN) {
      return b.set('y', y + speed * delta);
    } else if (direction === LEFT) {
      return b.set('x', x - speed * delta);
    } else if (direction === RIGHT) {
      return b.set('x', x + speed * delta);
    }
    throw new Error(`Invalid direction ${direction}`);
  });
  yield put({ type: A.SET_BULLETS, bullets: newBullets });
}

function* afterUpdate() {
  // TODO check conlisions

  let bullets = yield select(selectors.bullets);

  // Check if meet border
  bullets = bullets.filter(isInField);
  yield put({ type: A.SET_BULLETS, bullets });

  function isInField(bullet) {
    const x = Math.round(bullet.x);
    const y = Math.round(bullet.y);
    return (
      x >= 0 &&
      x + BULLET_SIZE < FIELD_BSIZE * BLOCK_SIZE &&
      y >= 0 &&
      y + BULLET_SIZE < FIELD_BSIZE * BLOCK_SIZE
    );
  }
}

export default function* bulletsSaga() {
  yield takeEvery(A.TICK, update);
  yield takeEvery(A.AFTER_TICK, afterUpdate);
}
