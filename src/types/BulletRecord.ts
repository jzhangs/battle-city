import { Record } from 'immutable';

const BulletRecord = Record({
  bulletId: 0 as BulletId,
  direction: 'up' as Direction,
  speed: 0,
  x: 0,
  y: 0,
  power: 1,
  tankId: -1 as TankId
});

const record = BulletRecord();
type BulletRecord = typeof record;

export default BulletRecord;
