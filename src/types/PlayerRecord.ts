import { Record } from 'immutable';

const PlayerRecord = Record({
  playerName: null as PlayerName,
  side: 'player' as Side,
  activeTankId: 0,
  lives: 0,
  score: 0,
  active: false
});

const record = PlayerRecord();
type PlayerRecord = typeof record;

export default PlayerRecord;
