export { default as TankRecord } from 'types/TankRecord';
export { default as PowerUpRecord } from 'types/PowerUpRecord';
export { default as ScoreRecord } from 'types/ScoreRecord';
export { default as ExplosionRecord } from 'types/ExplosionRecord';
export { default as FlickerRecord } from 'types/FlickerRecord';
export { default as TextRecord } from 'types/TextRecord';
export { default as BulletRecord } from 'types/BulletRecord';
export { default as PlayerRecord } from 'types/PlayerRecord';
export { default as EagleRecord } from 'types/EagleRecord';
export { default as MapRecord } from 'types/MapRecord';
export { State } from 'reducers';
export { PlayersMap } from 'reducers/players';
export { BulletsMap } from 'reducers/bullets';
export { TextsMap } from 'reducers/texts';
export { TanksMap } from 'reducers/tanks';
export { ScoresMap } from 'reducers/scores';
export { ExplosionsMap } from 'reducers/explosions';

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

  interface StageConfig {
    name: string;
    difficulty: number;
    map: string[];
    enemies: string[];
  }

  type Timing<T> = [T, number][];

  type PowerUpName = 'tank' | 'star' | 'grenade' | 'timer' | 'helmet' | 'shovel';
  type Scene = 'game-title' | 'game' | 'gameover' | 'statistics';
  type Direction = 'up' | 'down' | 'left' | 'right';

  type TankLevel = 'basic' | 'fast' | 'power' | 'armor';
  type TankColor = 'green' | 'yellow' | 'silver' | 'red' | 'auto';
  type TankId = number;
  type BulletId = number;
  type KillCount = number;
  type PowerUpId = number;
  type ScoreId = number;

  type PlayerName = string;
  type TextId = number;
  type FlickerId = number;
  type ExplosionId = number;

  type ExplosionShape = 's0' | 's1' | 's2' | 'b0' | 'b1';
  type FlickerShape = 0 | 1 | 2 | 3;

  type SteelIndex = number;
  type BrickIndex = number;
  type RiverIndex = number;

  type Side = 'player' | 'ai';

  type AICommand = AICommand.AICommand;

  namespace AICommand {
    type AICommand = Forward | Fire | Turn | Query;

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

    interface Query {
      type: 'query';
      query: 'my-tank-info' | 'map-info' | 'active-tanks-info' | 'my-fire-info';
    }
  }

  type Note = Note.Note;

  namespace Note {
    type Note = BulletComplete | Reach | QueryResultNote;

    interface BulletComplete {
      type: 'bullet-complete';
    }

    interface Reach {
      type: 'reach';
    }

    interface QueryResultNote {
      type: 'query-result';
      result: QueryResult;
    }
  }

  type QueryResult = QueryResult.QueryResult;

  namespace QueryResult {
    type QueryResult = MapInfo | MyTankInfo | ActiveTanksInfo | MyFireInfo;

    interface MyTankInfo {
      type: 'my-tank-info';
      tank: Object;
    }

    interface MapInfo {
      type: 'map-info';
      map: Object;
    }

    interface ActiveTanksInfo {
      type: 'active-tanks-info';
      tanks: Object[];
    }

    interface MyFireInfo {
      type: 'my-fire-info';
      canFire: boolean;
      cooldown: number;
      bulletCount: number;
    }
  }
}
