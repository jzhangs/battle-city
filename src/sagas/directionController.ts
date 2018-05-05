import { put, select, take } from 'redux-saga/effects';
import { getDirectionInfo, getTankMoveSpeed } from 'utils/common';
import canTankMove from 'utils/canTankMove';
import * as selectors from 'utils/selectors';
import { TankRecord, State } from 'types';

export default function* directionController(playerName: string, getPlayerInput: Function) {
  while (true) {
    const { delta } = yield take('TICK');
    const input = yield* getPlayerInput(delta);
    const tank: TankRecord = yield select(selectors.playerTank, playerName);
    const {
      game: { AIFrozenTimeout }
    }: State = yield select();
    if (tank == null || tank.frozenTimeout > 0 || (tank.side === 'ai' && AIFrozenTimeout > 0)) {
      continue;
    }
    const nextFrozenTimeout = tank.frozenTimeout <= 0 ? 0 : tank.frozenTimeout - delta;

    if (input == null) {
      if (tank.moving) {
        yield put({ type: 'STOP_MOVE', tankId: tank.tankId });
      }
    } else if (input.type === 'turn') {
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
        type: 'MOVE',
        tankId: tank.tankId,
        tank: movedTank
      });
    } else if (input.type === 'forward') {
      const speed = getTankMoveSpeed(tank);
      const distance = Math.min(delta * speed, input.maxDistance || Infinity);

      const { xy, updater } = getDirectionInfo(tank.direction);
      const movedTank = tank.update(xy, updater(distance));
      if (yield select(canTankMove, movedTank)) {
        yield put({
          type: 'MOVE',
          tankId: tank.tankId,
          tank: movedTank
        });
        if (!tank.moving) {
          yield put({ type: 'START_MOVE', tankId: tank.tankId });
        }
      }
    } else {
      throw new Error(`Invalid input type: ${input.type}`);
    }

    if (tank.frozenTimeout !== nextFrozenTimeout) {
      yield put<Action.SetFrozenTimeoutAction>({
        type: 'SET_FROZEN_TIMEOUT',
        tankId: tank.tankId,
        frozenTimeout: nextFrozenTimeout
      });
    }
  }
}
