import { State } from 'types';

export const playerTank = (state: State, playerName: string) => {
  const { active, tankId } = state.players.get(playerName);
  if (!active) {
    return null;
  }
  return state.tanks.get(tankId, null);
};
