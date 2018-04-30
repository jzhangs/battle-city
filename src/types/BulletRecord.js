import { Record } from 'immutable';
import { SIDE } from 'utils/consts';

const BulletRecord = Record({
  direction: null,
  side: SIDE.PLAYER,
  speed: 0,
  x: 0,
  y: 0,
  owner: null
});

export default BulletRecord;
