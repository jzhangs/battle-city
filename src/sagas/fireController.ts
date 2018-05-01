import { take, put, select } from 'redux-saga/effects';
import { getBulletStartPosition, getNextId } from 'utils/common';
import * as selectors from 'utils/selectors';
import { State, TankRecord } from 'types';

export default function* fireController(playerName: string, shouldFire: () => boolean) {
  let countDown = 0;
  while (true) {
    const { delta } = yield take('TICK');
    if (countDown > 0) {
      countDown -= delta;
    } else if (shouldFire()) {
      const tank: TankRecord = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      const { bullets: allBullets }: State = yield select();
      const bullets = allBullets.filter(bullet => bullet.tankId === tank.tankId);
      if (bullets.count() >= tank.bulletLimit) {
        continue;
      }

      const { x, y } = getBulletStartPosition(tank);
      yield put({
        type: 'ADD_BULLET',
        bulletId: getNextId('bullet'),
        direction: tank.direction,
        x,
        y,
        speed: tank.bulletSpeed,
        tankId: tank.tankId,
      });
      countDown = tank.bulletInterval;
    }
  }
}
