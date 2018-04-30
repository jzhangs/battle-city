import Mousetrap from 'mousetrap';
import { take, put, select } from 'redux-saga/effects';
import * as _ from 'lodash';
import * as R from 'ramda';

import { UP, DOWN, LEFT, RIGHT, DIRECTION_MAP } from 'utils/consts';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

export default function* directionController() {
  const pressed = [];
  let moving = false;

  bindKeyWithDirection('w', UP);
  bindKeyWithDirection('a', LEFT);
  bindKeyWithDirection('s', DOWN);
  bindKeyWithDirection('d', RIGHT);

  while (true) {
    const { delta } = yield take(A.TICK);
    const speed = 48 / 1000;
    const tank = yield select(selectors.playerTank);
    if (tank == null) {
      continue;
    }
    if (pressed.length > 0) {
      const direction = _.last(pressed);
      if (direction !== tank.get('direction')) {
        const turned = tank.set('direction', direction);
        const xy = DIRECTION_MAP[direction][0] === 'x' ? 'y' : 'x';
        const n = tank.get(xy) / 8;
        const useFloor = turned.set(xy, Math.floor(n) * 8);
        const useCeil = turned.set(xy, Math.ceil(n) * 8);
        const canMoveWhenUseFloor = yield select(selectors.canMove, useFloor);
        const canMoveWhenUseCeil = yield select(selectors.canMove, useCeil);
        let movedTank;
        if (!canMoveWhenUseFloor) {
          movedTank = useCeil;
        } else if (!canMoveWhenUseCeil) {
          movedTank = useFloor;
        } else {
          // use-round
          movedTank = turned.set(xy, Math.round(n) * 8);
        }
        yield put({
          type: A.MOVE,
          tankId: tank.tankId,
          tank: movedTank
        });
      } else {
        const distance = delta * speed;
        const [xy, incdec] = DIRECTION_MAP[direction];
        const movedTank = tank.update(
          xy,
          incdec === 'inc' ? R.add(distance) : R.subtract(R.__, distance)
        );
        if (yield select(selectors.canMove, movedTank)) {
          yield put({
            type: A.MOVE,
            tankId: tank.tankId,
            tank: movedTank
          });
          if (!moving) {
            yield put({ type: A.START_MOVE, tankId: tank.tankId });
            moving = true;
          }
        }
      }
    } else if (moving) {
        yield put({ type: A.STOP_MOVE, tankId: tank.tankId })
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
