import { Map, Set } from 'immutable';
import { TankRecord, BulletRecord, PlayerRecord, PowerUpRecord, MapRecord, ScoreRecord } from 'types';

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
      | DestroyBulletsAction
      | RemoveSteelsAction
      | RemoveBricksAction
      | UpdateMapAction
      | UpdateBulletsAction
      | LoadStageAction
      | Simple<'GAMEOVER'>
      | Simple<'GAMESTART'>
      | LoadSceneAction
      | Simple<'REMOVE_FIRST_REMAINING_ENEMY'>
      | DecrementPlayerLiveAction
      | ActivatePlayerAction
      | CreatePlayerAction
      | RemovePlayerAction
      | Simple<'DEACTIVATE_ALL_PLAYERS'>
      | SpawnExplosionAction
      | RemoveExplosionAction
      | SetTextAction
      | UpdateTextPositionAction
      | Simple<'DESTROY_EAGLE'>
      | SpawnTankAction
      | StartMoveAction
      | RemoveTankAction
      | StopMoveAction
      | RemoveTextAction
      | RemoveFlickerAction
      | SpawnFlickerAction
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
      | AddOneLifeAction
      | UpgradeTankAction;

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
      bulletId: BulletId;
      direction: Direction;
      speed: number;
      x: number;
      y: number;
      power?: number;
      tankId: TankId;
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

    export type DestroyBulletsAction = {
      type: 'DESTROY_BULLETS';
      bullets: Map<BulletId, BulletRecord>;
      spawnExplosion: boolean;
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

    export type LoadStageAction = {
      type: 'LOAD_STAGE';
      name: string;
    };

    export type SpawnExplosionAction = {
      type: 'SPAWN_EXPLOSION';
      x: number;
      y: number;
      explosionId: ExplosionId;
      explosionType: ExplosionType;
    };

    export type RemoveExplosionAction = {
      type: 'REMOVE_EXPLOSION';
      explosionId: ExplosionId;
    };

    export type SpawnFlickerAction = {
      type: 'SPAWN_FLICKER';
      flickerId: FlickerId;
      x: number;
      y: number;
    };

    export type RemoveFlickerAction = {
      type: 'REMOVE_FLICKER';
      flickerId: FlickerId;
    };

    export type SpawnTankAction = {
      type: 'SPAWN_TANK';
      tank: TankRecord;
    };

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

    export type DecrementPlayerLiveAction = {
      type: 'DECREMENT_PLAYER_LIVE';
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

    export type AddOneLifeAction = {
      type: 'ADD_ONE_LIFE';
      playerName: PlayerName;
    };

    export type UpgradeTankAction = {
      type: 'UPGRADE_TANK';
      tankId: TankId;
    };

    export type Simple<T> = {
      type: T;
    };
  }
}
