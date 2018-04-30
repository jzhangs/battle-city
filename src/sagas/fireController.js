import { take, put, select } from 'redux-saga/effects';
import { getBulletStartPosition, getNextId } from 'utils/common';
import * as A from 'utils/actions';
import * as selectors from 'utils/selectors';

export default function* fireController(playerName, shouldFire) {
  let countDown = 0;
  while (true) {
    const { delta } = yield take(A.TICK);
    if (countDown > 0) {
      countDown -= delta;
    } else if (shouldFire()) {
      const tank = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      const allBullets = yield select(selectors.bullets);
      const bullets = allBullets.filter(bullet => bullet.tankId === tank.tankId);
      if (bullets.count() >= tank.bulletLimit) {
        continue;
      }

      const { x, y } = getBulletStartPosition(tank);
      yield put(Object.assign({
        type: A.ADD_BULLET,
        bulletId: getNextId('bullet'),
        direction: tank.direction,
        x,
        y,
        speed: tank.bulletSpeed,
        tankId: tank.tankId
      }));
      countDown = tank.bulletInterval;
    }
  }
}
