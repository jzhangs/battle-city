import { Record } from 'immutable';

const BulletRecord = Record({
  bulletId: 0,
  direction: null,
  speed: 0,
  x: 0,
  y: 0,
  power: 1,
  tankId: -1
});

export default BulletRecord;
