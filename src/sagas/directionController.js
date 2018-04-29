import Mousetrap from 'mousetrap';
import { take, put } from 'redux-saga/effects';
import * as _ from 'lodash';

import { UP, DOWN, LEFT, RIGHT } from 'utils/consts';
import * as A from 'utils/actions';

export default function* directionController() {
  const pressed = [];
  let moving = false;

  bindKeyWithDirection('w', UP);
  bindKeyWithDirection('a', LEFT);
  bindKeyWithDirection('s', DOWN);
  bindKeyWithDirection('d', RIGHT);

  while (true) {
    const { delta } = yield take(A.TICK);
    const speed = 48; // 16px per second
    if (pressed.length > 0) {
      if (!moving) {
        yield put({ type: A.START_MOVE });
      }
      yield put({
        type: A.MOVE,
        direction: _.last(pressed),
        distance: delta * speed
      });
      moving = true;
    } else if (moving) {
      yield put({ type: A.STOP_MOVE });
      moving = false;
    }
  }

  function bindKeyWithDirection(key, direction) {
    Mousetrap.bind(
      key,
      () => {
        if (!pressed.includes(direction)) {
          pressed.push(direction);
        }
      },
      'keydown'
    );
    Mousetrap.bind(
      key,
      () => {
        _.pull(pressed, direction);
      },
      'keyup'
    );
  }
}
