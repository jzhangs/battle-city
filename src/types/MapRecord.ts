import { Record, Repeat } from 'immutable';
import { N_MAP } from 'utils/consts';

const MapRecord = Record({
  eagle: null,
  bricks: Repeat(false, N_MAP.BRICK ** 2).toList(),
  steels: Repeat(false, N_MAP.STEEL ** 2).toList(),
  rivers: Repeat(false, N_MAP.RIVER ** 2).toList(),
  snows: Repeat(false, N_MAP.SNOW ** 2).toList(),
  forests: Repeat(false, N_MAP.FOREST ** 2).toList()
});

const record = MapRecord();

type MapRecord = typeof record;
export default MapRecord;
