import { Map } from 'immutable';
import BulletRecord from 'types/BulletRecord';
import * as A from 'utils/actions';

export default function bullets(state = Map(), action) {
  if (action.type === A.ADD_BULLET) {
    const { direction, speed, x, y, owner } = action;
    return state.set(owner, BulletRecord({ owner, direction, speed, x, y }));
  } else if (action.type === A.DESTROY_BULLETS) {
    const set = action.bullets.toSet();
    return state.filterNot(bullet => set.has(bullet));
  } else if (action.type === A.UPDATE_BULLETS) {
    return state.merge(action.updatedBullets);
  }
  return state;
}