import { Record } from 'immutable';

const TankRecord = Record({
  tankId: 0,
  x: 0,
  y: 0,
  side: 'player' as Side,
  direction: 'up' as Direction,
  moving: false,
  level: 'basic' as TankLevel,
  color: 'auto' as TankColor,
  bulletSpeed: 0.08,
  bulletLimit: 1,
  bulletInterval: 300,
  hp: 1,
  withPowerUp: false,

  helmetDuration: 0,
  frozenTimeout: 0,
  cooldown: 0
});

const record = TankRecord();
type TankRecord = typeof record;

export default TankRecord;
