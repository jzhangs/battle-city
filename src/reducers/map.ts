import { List, Repeat, Record } from 'immutable';
import { N_MAP, BLOCK_SIZE } from 'utils/consts';
import parseStageMap from 'utils/parseStageMap';
import stageConfigs from 'stages';
import { MapRecord } from 'types';

export default function mapReducer(state = MapRecord(), action: Action) {
  if (action.type === 'LOAD_STAGE_MAP') {
    const { name } = action;
    return parseStageMap(stageConfigs[name].map);
  } else if (action.type === 'DESTROY_EAGLE') {
    return state.setIn(['eagle', 'broken'], true);
  } else if (action.type === 'REMOVE_BRICKS') {
    return state.update('bricks', bricks => bricks.map((set, t) => (action.ts.has(t) ? false : set)));
  } else if (action.type === 'REMOVE_STEELS') {
    return state.update('steels', steels => steels.map((set, t) => (action.ts.has(t) ? false : set)));
  } else if (action.type === 'UPDATE_MAP') {
    return action.map;
  }
  return state;
}
