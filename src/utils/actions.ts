import { Map, Set } from 'immutable';
import {
  FlickerRecord,
  TankRecord,
  BulletRecord,
  PlayerRecord,
  PowerUpRecord,
  MapRecord,
  ScoreRecord,
  ExplosionRecord
} from 'types';

declare global {
  type Action = Action.Action;

  namespace Action {
    export type Action =
      | MoveAction
      | StartMoveAction
      | TickAction
      | AfterTickAction
      | AddBulletAction
      | SetCooldownAction
      | SetHelmetDurationAction
      | SetFrozenTimeoutAction
      | SetAIFrozenTimeoutAction
      | RemoveBulletAction
      | RemoveSteelsAction
      | RemoveBricksAction
      | UpdateMapAction
      | UpdateBulletsAction
      | LoadStageMapAction
      | StartStageAction
      | Simple<'GAMESTART'>
      | Simple<'GAMEPAUSE'>
      | Simple<'GAMERESUME'>
      | Simple<'GAMEOVER'>
      | LoadSceneAction
      | Simple<'SHOW_HUD'>
      | Simple<'HIDE_HUD'>
      | Simple<'REMOVE_FIRST_REMAINING_ENEMY'>
      | IncrementPlayerLifeAction
      | DecrementPlayerLifeAction
      | ActivatePlayerAction
      | CreatePlayerAction
      | RemovePlayerAction
      | Simple<'DEACTIVATE_ALL_PLAYERS'>
      | AddOrUpdateExplosion
      | RemoveExplosionAction
      | SetTextAction
      | UpdateTextPositionAction
      | Simple<'DESTROY_EAGLE'>
      | AddTankAction
      | StartMoveAction
      | RemoveTankAction
      | StopMoveAction
      | RemoveTextAction
      | RemoveFlickerAction
      | AddOrUpdateFlickerAction
      | HurtAction
      | KillAction
      | IncKillCout
      | UpdateTransientKillInfo
      | Simple<'SHOW_TOTAL_KILL_COUNT'>
      | AddPowerUpAction
      | RemovePowerUpAction
      | UpdatePowerUpAction
      | PickPowerUpAction
      | AddScoreAction
      | RemoveScoreAction
      | UpgradeTankAction
      | UpdateCurtainAction;

    export type ActionType = Action['type'];

    export type HurtAction = {
      type: 'HURT';
      targetTank: TankRecord;
      hurt: number;
    };

    export type KillAction = {
      type: 'KILL';
      targetTank: TankRecord;
      sourceTank: TankRecord;
      targetPlayer: PlayerRecord;
      sourcePlayer: PlayerRecord;
    };

    export type UpdateTransientKillInfo = {
      type: 'UPDATE_TRANSIENT_KILL_INFO';
      info: Map<PlayerName, Map<TankLevel, KillCount>>;
    };

    export type IncKillCout = {
      type: 'INC_KILL_COUNT';
      playerName: PlayerName;
      level: TankLevel;
    };

    export type MoveAction = {
      type: 'MOVE';
      tankId: TankId;
      tank: TankRecord;
    };

    export type StartMoveAction = {
      type: 'START_MOVE';
      tankId: TankId;
    };

    export type StopMoveAction = {
      type: 'STOP_MOVE';
      tankId: TankId;
    };

    export type TickAction = {
      type: 'TICK';
      delta: number;
    };

    export type AfterTickAction = {
      type: 'AFTER_TICK';
      delta: number;
    };

    export type AddBulletAction = {
      type: 'ADD_BULLET';
      bullet: BulletRecord;
    };

    export type SetHelmetDurationAction = {
      type: 'SET_HELMET_DURATION';
      tankId: TankId;
      duration: number;
    };

    export type SetCooldownAction = {
      type: 'SET_COOLDOWN';
      tankId: TankId;
      cooldown: number;
    };

    export type SetAIFrozenTimeoutAction = {
      type: 'SET_AI_FROZEN_TIMEOUT';
      AIFrozenTimeout: number;
    };

    export type SetFrozenTimeoutAction = {
      type: 'SET_FROZEN_TIMEOUT';
      tankId: TankId;
      frozenTimeout: number;
    };

    export type RemoveBulletAction = {
      type: 'REMOVE_BULLET';
      bulletId: BulletId;
    };

    export type RemoveSteelsAction = {
      type: 'REMOVE_STEELS';
      ts: Set<SteelIndex>;
    };

    export type RemoveBricksAction = {
      type: 'REMOVE_BRICKS';
      ts: Set<BrickIndex>;
    };

    export type UpdateMapAction = {
      type: 'UPDATE_MAP';
      map: MapRecord;
    };

    export type UpdateBulletsAction = {
      type: 'UPDATE_BULLETS';
      updatedBullets: Map<BulletId, BulletRecord>;
    };

    export interface LoadStageMapAction {
      type: 'LOAD_STAGE_MAP';
      name: string;
    }

    export interface StartStageAction {
      type: 'START_STAGE';
      name: string;
    }

    export interface AddOrUpdateExplosion {
      type: 'ADD_OR_UPDATE_EXPLOSION';
      explosion: ExplosionRecord;
    }

    export interface RemoveExplosionAction {
      type: 'REMOVE_EXPLOSION';
      explosionId: ExplosionId;
    }

    export interface AddOrUpdateFlickerAction {
      type: 'ADD_OR_UPDATE_FLICKER';
      flicker: FlickerRecord;
    }

    export interface RemoveFlickerAction {
      type: 'REMOVE_FLICKER';
      flickerId: FlickerId;
    }

    export interface AddTankAction {
      type: 'ADD_TANK';
      tank: TankRecord;
    }

    export type RemoveTankAction = {
      type: 'REMOVE_TANK';
      tankId: TankId;
    };

    export type ActivatePlayerAction = {
      type: 'ACTIVATE_PLAYER';
      playerName: PlayerName;
      tankId: TankId;
    };

    export type CreatePlayerAction = {
      type: 'CREATE_PLAYER';
      player: PlayerRecord;
    };

    export type RemovePlayerAction = {
      type: 'REMOVE_PLAYER';
      playerName: PlayerName;
    };

    export type SetTextAction = {
      type: 'SET_TEXT';
      textId: TextId;
      content: string;
      fill: string;
      x: number;
      y: number;
    };

    export type RemoveTextAction = {
      type: 'REMOVE_TEXT';
      textId: TextId;
    };

    export type UpdateTextPositionAction = {
      type: 'UPDATE_TEXT_POSITION';
      textIds: Array<TextId>;
      direction: Direction;
      distance: number;
    };

    export type IncrementPlayerLifeAction = {
      type: 'INCREMENT_PLAYER_LIFE';
      playerName: PlayerName;
    };

    export type DecrementPlayerLifeAction = {
      type: 'DECREMENT_PLAYER_LIFE';
      playerName: PlayerName;
    };

    export type LoadSceneAction = {
      type: 'LOAD_SCENE';
      scene: Scene;
    };

    export type AddPowerUpAction = {
      type: 'ADD_POWER_UP';
      powerUp: PowerUpRecord;
    };

    export type RemovePowerUpAction = {
      type: 'REMOVE_POWER_UP';
      powerUpId: PowerUpId;
    };

    export type UpdatePowerUpAction = {
      type: 'UPDATE_POWER_UP';
      powerUp: PowerUpRecord;
    };

    export type PickPowerUpAction = {
      type: 'PICK_POWER_UP';
      player: PlayerRecord;
      tank: TankRecord;
      powerUp: PowerUpRecord;
    };

    export interface AddScoreAction {
      type: 'ADD_SCORE';
      score: ScoreRecord;
    }

    export interface RemoveScoreAction {
      type: 'REMOVE_SCORE';
      scoreId: ScoreId;
    }

    export type UpgradeTankAction = {
      type: 'UPGRADE_TANK';
      tankId: TankId;
    };

    export interface UpdateCurtainAction {
      type: 'UPDATE_CURTAIN';
      curtainName: 'stage-enter-curtain';
      t: number;
    }

    export type Simple<T> = {
      type: T;
    };
  }
}
