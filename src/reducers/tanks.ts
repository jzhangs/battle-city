import { Map } from 'immutable';
import { TankRecord } from 'types';
import { incTankLevel } from 'utils/common';

export type TanksMap = Map<TankId, TankRecord>;

export default function tanks(state = Map() as TanksMap, action: Action) {
  if (action.type === 'ADD_TANK') {
    return state.set(action.tank.tankId, TankRecord(action.tank));
  } else if (action.type === 'HURT') {
    const tankId = action.targetTank.tankId;
    return state.update(tankId, t => t.update('hp', hp => hp - action.hurt));
  } else if (action.type === 'START_STAGE') {
    return state.clear();
  } else if (action.type === 'MOVE') {
    return state.set(action.tankId, action.tank);
  } else if (action.type === 'START_MOVE') {
    return state.setIn([action.tankId, 'moving'], true);
  } else if (action.type === 'STOP_MOVE') {
    return state.setIn([action.tankId, 'moving'], false);
  } else if (action.type === 'UPGRADE_TANK') {
    return state.update(action.tankId, incTankLevel);
  } else if (action.type === 'REMOVE_TANK') {
    return state.update(action.tankId, tank =>
      tank.merge({
        active: false,
        cooldown: 0,
        frozenTimeout: 0,
        helmetDuration: 0,
        moving: false,
        withPowerUp: false
      })
    );
  } else if (action.type === 'SET_COOLDOWN') {
    return state.update(action.tankId, tank => tank.set('cooldown', action.cooldown));
  } else if (action.type === 'SET_AI_FROZEN_TIMEOUT') {
    return state.map(tank => (tank.side === 'ai' ? tank.set('moving', false) : tank));
  } else if (action.type === 'SET_FROZEN_TIMEOUT') {
    return state.update(action.tankId, tank =>
      tank
        .set('frozenTimeout', action.frozenTimeout)
        .set('moving', tank.frozenTimeout <= 0 && action.frozenTimeout > 0 && tank.moving)
    );
  } else if (action.type === 'SET_HELMET_DURATION') {
    return state.update(action.tankId, tank => tank.set('helmetDuration', Math.max(0, action.duration)));
  }
  return state;
}
