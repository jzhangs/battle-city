export type StageConfig = {
  name: string;
  difficulty: 'easy' | 'normal' | 'hard';
  map: string[];
  enemies: string;
};

export { default as TankRecord } from 'types/TankRecord';
export { default as FlickerRecord } from 'types/FlickerRecord';
export { default as TextRecord } from 'types/TextRecord';
export { default as BulletRecord } from 'types/BulletRecord';
export { default as PlayerRecord } from 'types/PlayerRecord';
export { EagleRecord } from 'reducers/map';
export { State } from 'reducers';
export { PlayersMap } from 'reducers/players';
export { BulletsMap } from 'reducers/bullets';
export { TextsMap } from 'reducers/texts';
export { TanksMap } from 'reducers/tanks';

export interface PlayerControllerConfig {
  fire: string;
  up: string;
  down: string;
  left: string;
  right: string;
}

export type Input = { type: 'turn'; direction: Direction } | { type: 'forward'; maxDistance?: number };

declare global {
  interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Vector {
    dx: number;
    dy: number;
  }

  type PowerUpName = 'tank' | 'star' | 'grenade' | 'timer' | 'helmet' | 'shovel';
  type Overlay = '' | 'gameover' | 'statistics';
  type Direction = 'up' | 'down' | 'left' | 'right';

  type TankLevel = 'basic' | 'fast' | 'power' | 'armor';
  type TankId = number;
  type BulletId = number;
  type PlayerName = string;
  type TextId = number;
  type FlickerId = number;

  type SteelIndex = number;
  type BrickIndex = number;
  type RiverIndex = number;

  type ExplosionType = 'bullet' | 'tank';
  type ExplosionId = number;
  type Side = 'player' | 'ai';

  type Note = string;

  type AICommand = AICommand.AICommand;

  namespace AICommand {
    type AICommand = Forward | Fire | Turn;

    interface Forward {
      type: 'forward';
      forwardLength: number;
    }

    interface Fire {
      type: 'fire';
    }

    interface Turn {
      type: 'turn';
      direction: Direction;
    }
  }
}
