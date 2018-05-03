import { Record } from 'immutable';
import { BLOCK_SIZE } from 'utils/consts';

const EagleRecord = Record({
  x: 6 * BLOCK_SIZE,
  y: 12 * BLOCK_SIZE,
  broken: false
});

const record = EagleRecord();
type EagleRecord = typeof record;

export default EagleRecord;
