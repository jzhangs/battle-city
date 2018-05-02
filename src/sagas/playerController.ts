import { all, take, fork, select } from 'redux-saga/effects';
import * as selectors from 'utils/selectors';
import * as _ from 'lodash';
import directionController from 'sagas/directionController';
import fireController from 'sagas/fireController';
import { PlayerControllerConfig, TankRecord } from 'types';

const Mousetrap = require('mousetrap');

export default function* playerController(playerName: string, config: PlayerControllerConfig) {
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
      yield take('TICK');
      firePressed = false;
    }
  });

  const pressed: Direction[] = [];

  function getDirectionControlInfo() {
    if (pressed.length > 0) {
      return { direction: _.last(pressed) };
    }
    return { direction: null };
  }

  function shouldFire() {
    return firePressing || firePressed;
  }

  function bindKeyWithDirection(key: string, direction: Direction) {
    Mousetrap.bind(
      key,
      () => {
        if (pressed.indexOf(direction) === -1) {
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

  bindKeyWithDirection(config.up, 'up');
  bindKeyWithDirection(config.left, 'left');
  bindKeyWithDirection(config.down, 'down');
  bindKeyWithDirection(config.right, 'right');

  function* getPlayerInput() {
    const tank: TankRecord = yield select(selectors.playerTank, playerName);
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
    const action: Action.ActivatePlayerAction = yield take('ACTIVATE_PLAYER');
    if (action.playerName === playerName) {
      yield all([
        directionController(playerName, getPlayerInput),
        fireController(playerName, shouldFire)
      ]);
    }
  }
}
