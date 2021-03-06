import { combineReducers } from 'redux';
import game, { GameRecord } from 'reducers/game';
import players, { PlayersMap } from 'reducers/players';
import bullets, { BulletsMap } from 'reducers/bullets';
import explosions, { ExplosionsMap } from 'reducers/explosions';
import flickers, { FlickersMap } from 'reducers/flickers';
import map from 'reducers/map';
import tanks, { TanksMap } from 'reducers/tanks';
import texts, { TextsMap } from 'reducers/texts';
import powerUps, { PowerUpsMap } from 'reducers/powerUps';
import scores, { ScoresMap } from 'reducers/scores';
import { MapRecord } from 'types';

export type State = {
  game: GameRecord;
  players: PlayersMap;
  bullets: BulletsMap;
  explosions: ExplosionsMap;
  map: MapRecord;
  time: number;
  tanks: TanksMap;
  flickers: FlickersMap;
  texts: TextsMap;
  powerUps: PowerUpsMap;
  scores: ScoresMap;
};

export function time(state = 0, action: Action) {
  if (action.type === 'TICK') {
    return state + action.delta;
  } else {
    return state;
  }
}

export default combineReducers<State>({
  game,
  players,
  bullets,
  explosions,
  map,
  time,
  tanks,
  flickers,
  texts,
  powerUps,
  scores
});
