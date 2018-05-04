import { take, put, select } from 'redux-saga/effects';
import { getBulletStartPosition, getNextId } from 'utils/common';
import * as selectors from 'utils/selectors';
import { State, TankRecord } from 'types';

export default function* fireController(playerName: string, shouldFire: () => boolean) {
  while (true) {
    const { delta }: Action.TickAction = yield take('TICK');
    const { bullets: allBullets }: State = yield select();
    const tank: TankRecord = yield select(selectors.playerTank, playerName);
    const {
      game: { AIFrozenTimeout }
    }: State = yield select();
    if (tank == null || (tank.side === 'ai' && AIFrozenTimeout > 0)) {
      continue;
    }
    let nextCooldown = tank.cooldown <= 0 ? 0 : tank.cooldown - delta;

    if (tank.cooldown <= 0 && shouldFire()) {
      const bullets = allBullets.filter(bullet => bullet.tankId === tank.tankId);
      if (bullets.count() < tank.bulletLimit) {
        const { x, y } = getBulletStartPosition(tank);
        yield put({
          type: 'ADD_BULLET',
          bulletId: getNextId('bullet'),
          direction: tank.direction,
          x,
          y,
          speed: tank.bulletSpeed,
          tankId: tank.tankId
        });
        nextCooldown = tank.bulletInterval;
      }
    }

    if (tank.cooldown !== nextCooldown) {
      yield put<Action>({
        type: 'SET_COOLDOWN',
        tankId: tank.tankId,
        cooldown: nextCooldown
      });
    }
  }
}
