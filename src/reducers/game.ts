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
    activeEnemyCount: 0,
    killInfo: Map<PlayerName, Map<TankLevel, KillCount>>()
  },
  'GameRecord'
);

export type GameRecord = Record.Instance<Base> & Readonly<Base>;

const inc = (x: number) => x + 1;
const dec = (x: number) => x - 1;

export default function game(state = GameRecord(), action: Action) {
  if (action.type === 'SHOW_OVERLAY') {
    return state.set('overlay', action.overlay);
  } else if (action.type === 'REMOVE_OVERLAY') {
    return state.set('overlay', null);
  } else if (action.type === 'LOAD_STAGE') {
    return state.set('currentStage', action.name).set('remainingEnemyCount', defaultRemainingEnemyCount);
  } else if (action.type === 'DECREMENT_REMAINING_ENEMY_COUNT') {
    return state.update('remainingEnemyCount', dec);
  } else if (action.type === 'KILL') {
    const { sourcePlayer, targetPlayer, targetTank } = action;
    if (sourcePlayer.playerName.startsWith('player')) {
      const nextState = state.update('killInfo', killInfo =>
        killInfo.update(sourcePlayer.playerName, Map(), m => m.update('basic', 0, inc))
      );
      return nextState;
    } else {
      return state;
    }
  } else {
    return state;
  }
}
