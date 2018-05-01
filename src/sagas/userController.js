import Mousetrap from 'mousetrap';
import { take, fork, select } from 'redux-saga/effects';
import { UP, DOWN, LEFT, RIGHT } from 'utils/consts';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';
import * as _ from 'lodash';
import directionController from 'sagas/directionController';
import fireController from 'sagas/fireController';

export default function* userController(playerName, config) {
  let firePressing = false;
  let firePressed = false;
  Mousetrap.bind(
    config.fire,
    () => {
      firePressing = true;
      firePressed = true;
    },
    'keydown'
  );
  Mousetrap.bind(
    config.fire,
    () => {
      firePressing = false;
    },
    'keyup'
  );

  yield fork(function* handleTick() {
    while (true) {
      yield take(A.TICK);
      firePressed = false;
    }
  });

  const pressed = [];

  function getDirectionControlInfo() {
    if (pressed.length > 0) {
      return { direction: _.last(pressed) };
    }
    return { direction: null };
  }

  function shouldFire() {
    return firePressing || firePressed;
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

  bindKeyWithDirection(config.up, UP);
  bindKeyWithDirection(config.left, LEFT);
  bindKeyWithDirection(config.down, DOWN);
  bindKeyWithDirection(config.right, RIGHT);

  function* getUserPlayerInput() {
    const tank = yield select(selectors.playerTank, playerName);
    if (tank != null) {
      const { direction } = getDirectionControlInfo();
      if (direction != null) {
        if (direction !== tank.direction) {
          return { type: 'turn', direction };
        }
        return { type: 'forward' };
      }
    }
    return null;
  }

  while (true) {
    const action = yield take(A.ACTIVATE_PLAYER);
    if (action.playerName === playerName) {
      yield [
        directionController(playerName, getUserPlayerInput),
        fireController(playerName, shouldFire)
      ];
    }
  }
}
