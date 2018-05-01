import { put, select, take } from 'redux-saga/effects';
import { getDirectionInfo } from 'utils/common';
import canTankMove from 'utils/canTankMove';
import * as selectors from 'utils/selectors';
import * as A from 'utils/actions';

export default function* directionController(playerName, getPlayerInput) {
  while (true) {
    const { delta } = yield take(A.TICK);
    const input = yield* getPlayerInput(delta);
    if (input == null) {
      const tank = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      if (tank.moving) {
        yield put({ type: A.STOP_MOVE, tankId: tank.tankId });
      }
    } else if (input.type === 'turn') {
      const tank = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      const { direction } = input;
      const turned = tank.set('direction', direction);

      const { xy } = getDirectionInfo(direction, true);
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
    } else if (input.type === 'forward') {
      const tank = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      const speed = 48 / 1000; // todo
      const distance = Math.min(delta * speed, input.maxDistance || Infinity);

      const { xy, updater } = getDirectionInfo(tank.direction);
      const movedTank = tank.update(xy, updater(distance));
      if (yield select(canTankMove, movedTank)) {
        yield put({
          type: A.MOVE,
          tankId: tank.tankId,
          tank: movedTank
        });
        if (!tank.moving) {
          yield put({ type: A.START_MOVE, tankId: tank.tankId });
        }
      }
    } else {
      throw new Error(`Invalid input type: ${input.type}`);
    }
  }
}
