import * as R from 'ramda';
import { takeEvery, put, select } from 'redux-saga/effects';

import { BULLET_SIZE, FIELD_BSIZE, BLOCK_SIZE, DIRECTION_MAP } from 'utils/consts';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

function* update({ delta }) {
  const bullets = yield select(selectors.bullets);
  const updatedBullets = bullets.map((bullet) => {
    const { direction, speed } = bullet;
    const distance = speed * delta;
    const [xy, incdec] = DIRECTION_MAP[direction];
    return bullet.update(xy, incdec === 'inc' ? R.add(distance) : R.subtract(R.__, distance));
  });
  yield put({ type: A.UPDATE_BULLETS, updatedBullets });
}

function* afterUpdate() {
  // TODO check conlisions

  const bullets = yield select(selectors.bullets);

  // Check if meet border
  const outBullets = bullets.filterNot(isInField);
  yield put({ type: A.DESTROY_BULLETS, bullets: outBullets });

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
