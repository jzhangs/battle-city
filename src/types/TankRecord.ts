import { Record } from 'immutable';

const TankRecord = Record({
  active: true,
  tankId: 0,
  x: 0,
  y: 0,
  side: 'player' as Side,
  direction: 'up' as Direction,
  moving: false,
  level: 'basic' as TankLevel,
  color: 'auto' as TankColor,
  hp: 1,
  withPowerUp: false,

  helmetDuration: 0,
  frozenTimeout: 0,
  cooldown: 0
});

const record = TankRecord();
type TankRecord = typeof record;

export default TankRecord;
