import { combineReducers } from 'redux';
import explosions from 'reducers/explosions';
import flickers from 'reducers/flickers';
import game from 'reducers/game';
import players from 'reducers/players';
import texts from 'reducers/texts';

import map from 'reducers/map';
import bullets from 'reducers/bullets';
import tanks from 'reducers/tanks';
import * as A from 'utils/actions';

function time(state = 0, action) {
  if (action.type === A.TICK) {
    return state + action.delta;
  }
  return state;
}

export default combineReducers({
  players,
  bullets,
  map,
  time,
  explosions,
  flickers,
  tanks,
  game,
  texts
});
