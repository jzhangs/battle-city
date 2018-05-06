import { Map, Record, List, Repeat } from 'immutable';
import parseStageEnemies from 'utils/parseStageEnemies';
import stageConfigs from 'stages';

const emptyTransientKillInfo = Map({
  'player-1': Map({
    basic: -1,
    fast: -1,
    power: -1,
    armor: -1
  }),
  'player-2': Map({
    basic: -1,
    fast: -1,
    power: -1,
    armor: -1
  })
}) as Map<PlayerName, Map<TankLevel, KillCount>>;

const defaultRemainingEnemies = Repeat('basic' as TankLevel, 20).toList();

type Base = {
  scene: Scene;
  currentStage: string;
  remainingEnemies: List<TankLevel>;
  killInfo: Map<PlayerName, Map<TankLevel, KillCount>>;
  transientKillInfo: Map<PlayerName, Map<TankLevel, KillCount>>;
  showTotalKillCount: boolean;
  AIFrozenTimeout: number;
  paused: boolean;
  showHUD: boolean;
  stageEnterCurtainT: number;
};

export const GameRecord = Record(
  {
    scene: 'game-title' as Scene,
    currentStage: null as string,
    remainingEnemies: defaultRemainingEnemies,
    killInfo: Map<PlayerName, Map<TankLevel, KillCount>>(),
    transientKillInfo: emptyTransientKillInfo,
    showTotalKillCount: false,
    AIFrozenTimeout: 0,
    paused: false,
    showHUD: false,
    stageEnterCurtainT: 0
  },
  'GameRecord'
);

export type GameRecord = Record.Instance<Base> & Readonly<Base>;

export default function game(state = GameRecord(), action: Action) {
  if (action.type === 'LOAD_SCENE') {
    return state.set('scene', action.scene);
  } else if (action.type === 'START_STAGE') {
    return state.merge({
      currentStage: action.name,
      killInfo: Map(),
      transientKillInfo: emptyTransientKillInfo,
      showTotalKillCount: false,
      remainingEnemies: parseStageEnemies(stageConfigs[action.name].enemies)
    });
  } else if (action.type === 'REMOVE_FIRST_REMAINING_ENEMY') {
    return state.update('remainingEnemies', enemies => enemies.shift());
  } else if (action.type === 'INC_KILL_COUNT') {
    const { playerName, level } = action;
    return state.updateIn(['killInfo', playerName, level], x => (!x ? 1 : x + 1));
  } else if (action.type === 'UPDATE_TRANSIENT_KILL_INFO') {
    return state.set('transientKillInfo', action.info);
  } else if (action.type === 'SHOW_TOTAL_KILL_COUNT') {
    return state.set('showTotalKillCount', true);
  } else if (action.type === 'SET_AI_FROZEN_TIMEOUT') {
    return state.set('AIFrozenTimeout', action.AIFrozenTimeout);
  } else if (action.type === 'GAMEPAUSE') {
    return state.set('paused', true);
  } else if (action.type === 'GAMERESUME') {
    return state.set('paused', false);
  } else if (action.type === 'UPDATE_CURTAIN') {
    return state.set('stageEnterCurtainT', action.t);
  } else if (action.type === 'SHOW_HUD') {
    return state.set('showHUD', true);
  } else if (action.type === 'HIDE_HUD') {
    return state.set('showHUD', false);
  }

  return state;
}
