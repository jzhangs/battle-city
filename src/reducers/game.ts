import { Map, Record } from 'immutable';

type Base = {
  overlay: string;
  remainingEnemyCount: number;
};

type KillCount = number;

const defaultRemainingEnemyCount = 20;

export const GameRecord = Record(
  {
    overlay: '' as Overlay,
    currentStage: null as string,
    remainingEnemyCount: defaultRemainingEnemyCount,
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
    return state
      .set('currentStage', action.name)
      .set('remainingEnemyCount', defaultRemainingEnemyCount)
      .set('killInfo', Map());
  } else if (action.type === 'DECREMENT_REMAINING_ENEMY_COUNT') {
    return state.update('remainingEnemyCount', x => x - 1);
  } else if (action.type === 'INC_KILL_COUNT') {
    const { playerName, level } = action;
    return state.updateIn(['killInfo', playerName, level], x => (!x ? 1 : x + 1));
  } else {
    return state;
  }
}
