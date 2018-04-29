import Mousetrap from 'mousetrap';
import { take, put, select } from 'redux-saga/effects';

import { BLOCK_SIZE } from 'utils/consts';
import { getBulletStartPosition } from 'utils/common';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

export default function* fireController() {
  let pressing = false;
  let pressed = false;
  Mousetrap.bind(
    'j',
    () => {
      pressing = true;
      pressed = true;
    },
    'keydown'
  );
  Mousetrap.bind(
    'j',
    () => {
      pressing = false;
    },
    'keyup'
  );

  while (true) {
    yield take(A.TICK);
    if ((pressing || pressed) && (yield select(selectors.canFire, 'player'))) {
      const player = yield select(selectors.player);
      const { x, y, direction } = player.toObject();
      yield put(Object.assign(
        {
          type: A.ADD_BULLET,
          direction,
          owner: 'player',
          speed: 5 * BLOCK_SIZE
        },
        getBulletStartPosition(x, y, direction)
      ));
    }
    pressed = false;
  }
}
