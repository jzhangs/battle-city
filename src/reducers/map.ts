import { List, Repeat, Record } from 'immutable';
import { N_MAP, BLOCK_SIZE } from 'utils/consts';
import parseStageMap from 'utils/parseStageMap';
import stageConfigs from 'stages';

type EagleBase = {
  x: number;
  y: number;
  broken: boolean;
};
export type EagleRecord = Record.Instance<EagleBase> & Readonly<EagleBase>;
export const EagleRecord = Record({
  x: 6 * BLOCK_SIZE,
  y: 12 * BLOCK_SIZE,
  broken: false
});

type MapBase = {
  eagle: EagleRecord;
  bricks: List<boolean>;
  steels: List<boolean>;
  rivers: List<boolean>;
  snows: List<boolean>;
  forests: List<boolean>;
};
export type MapRecord = Record.Instance<MapBase> & Readonly<MapBase>;
export const MapRecord = Record({
  eagle: EagleRecord(),
  bricks: Repeat(false, N_MAP.BRICK ** 2).toList(),
  steels: Repeat(false, N_MAP.STEEL ** 2).toList(),
  rivers: Repeat(false, N_MAP.RIVER ** 2).toList(),
  snows: Repeat(false, N_MAP.SNOW ** 2).toList(),
  forests: Repeat(false, N_MAP.FOREST ** 2).toList()
});

export default function mapReducer(state = MapRecord(), action: Action) {
  if (action.type === 'LOAD_STAGE') {
    const { name } = action;
    return parseStageMap(stageConfigs[name].map);
  } else if (action.type === 'DESTROY_EAGLE') {
    return state.setIn(['eagle', 'broken'], true);
  } else if (action.type === 'DESTROY_BRICKS') {
    return state.update('bricks', bricks => bricks.map((set, t) => (action.ts.has(t) ? false : set)));
  } else if (action.type === 'DESTROY_STEELS') {
    return state.update('steels', steels => steels.map((set, t) => (action.ts.has(t) ? false : set)));
  } else {
    return state;
  }
}
