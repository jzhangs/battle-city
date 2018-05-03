import { Map, Record, List } from 'immutable';
import parseStageEnemies from 'utils/parseStageEnemies';
import stageConfigs from 'stages';

type Base = {
  overlay: string;
  currentStage: string;
  remainingEnemies: List<TankLevel>;
  killInfo: Map<PlayerName, Map<TankLevel, KillCount>>;
};

type KillCount = number;

export const GameRecord = Record(
  {
    overlay: '' as Overlay,
    currentStage: null as string,
    remainingEnemies: List<TankLevel>(),
    killInfo: Map<PlayerName, Map<TankLevel, KillCount>>()
  },
  'GameRecord'
);

export type GameRecord = Record.Instance<Base> & Readonly<Base>;

export default function game(state = GameRecord(), action: Action) {
  if (action.type === 'SHOW_OVERLAY') {
    return state.set('overlay', action.overlay);
  } else if (action.type === 'REMOVE_OVERLAY') {
    return state.set('overlay', null);
  } else if (action.type === 'LOAD_STAGE') {
    return state.merge({
      currentStage: action.name,
      killInfo: Map(),
      remainingEnemies: parseStageEnemies(stageConfigs[action.name].enemies)
    });
  } else if (action.type === 'REMOVE_FIRST_REMAINING_ENEMY') {
    return state.update('remainingEnemies', enemies => enemies.shift());
  } else if (action.type === 'INC_KILL_COUNT') {
    const { playerName, level } = action;
    return state.updateIn(['killInfo', playerName, level], x => (!x ? 1 : x + 1));
  } else {
    return state;
  }
}
