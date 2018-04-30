import { take, put, select } from 'redux-saga/effects';
import * as R from 'ramda';

import { DIRECTION_MAP } from 'utils/consts';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';
import canTankMove from 'utils/canTankMove';

export default function* directionController(playerName, getControlInfo) {
  while (true) {
    const { delta } = yield take(A.TICK);
    const speed = 48 / 1000;
    const tank = yield select(selectors.playerTank, playerName);
    if (tank == null) {
      continue;
    }
    // { direction: null | UP }
    const { direction } = getControlInfo();
    if (direction != null) {
      if (direction !== tank.get('direction')) {
        const turned = tank.set('direction', direction);
        const xy = DIRECTION_MAP[direction][0] === 'x' ? 'y' : 'x';
        const n = tank.get(xy) / 8;
        const useFloor = turned.set(xy, Math.floor(n) * 8);
        const useCeil = turned.set(xy, Math.ceil(n) * 8);
        const canMoveWhenUseFloor = yield select(canTankMove, useFloor);
        const canMoveWhenUseCeil = yield select(canTankMove, useCeil);
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
        if (yield select(canTankMove, movedTank)) {
          yield put({
            type: A.MOVE,
            tankId: tank.tankId,
            tank: movedTank
          });
          if (!tank.get('moving')) {
            yield put({ type: A.START_MOVE, tankId: tank.tankId });
          }
        }
      }
    } else if (tank.get('moving')) {
      yield put({ type: A.STOP_MOVE, tankId: tank.tankId });
    }
  }
}
