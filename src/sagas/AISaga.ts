import { channel as makeChannel, Channel, eventChannel, Task } from 'redux-saga';
import { fork, put, select, take, spawn, all } from 'redux-saga/effects';

import directionController from 'sagas/directionController';
import fireController from 'sagas/fireController';
import { spawnTank } from 'sagas/common';
import * as selectors from 'utils/selectors';
import { getDirectionInfo, getNextId, getTankBulletLimit, getWithPowerUpProbability } from 'utils/common';
import { State } from 'reducers';
import { TankRecord, PlayerRecord } from 'types';
import AIWorker = require('worker-loader!ai/worker');

function* handleCmds(playerName: string, cmdChannel: Channel<AICommand>, noteChannel: Channel<Note>) {
  let fire = false;
  let nextDirection: Direction = null;
  let forwardLength = 0;
  let startPos: number;

  yield fork(directionController, playerName, getAIInput);
  yield fork(fireController, playerName, () => {
    if (fire) {
      fire = false;
      return true;
    } else {
      return false;
    }
  });

  while (true) {
    const command: AICommand = yield take(cmdChannel);
    // console.log('[saga] receive:', command)
    if (command.type === 'forward') {
      const tank = yield select(selectors.playerTank, playerName);
      if (tank == null) {
        continue;
      }
      const { xy } = getDirectionInfo(tank.direction);
      startPos = tank.get(xy);
      forwardLength = command.forwardLength;
    } else if (command.type === 'fire') {
      fire = true;
    } else if (command.type === 'turn') {
      nextDirection = command.direction;
    } else if (command.type === 'query') {
      if (command.query === 'my-tank-info') {
        const tank: TankRecord = yield select(selectors.playerTank, playerName);
        if (!tank) continue;
        noteChannel.put({
          type: 'query-result',
          result: {
            type: 'my-tank-info',
            tank: tank && tank.toObject()
          }
        });
      } else if (command.query === 'map-info') {
        const { map }: State = yield select();
        noteChannel.put({
          type: 'query-result',
          result: { type: 'map-info', map: map.toJS() }
        });
      } else if (command.query === 'active-tanks-info') {
        const { tanks }: State = yield select();
        noteChannel.put({
          type: 'query-result',
          result: {
            type: 'active-tanks-info',
            tanks: tanks
              .filter(t => t.active)
              .map(t => t.toObject())
              .toArray()
          }
        });
      } else if (command.query === 'my-fire-info') {
        const tank: TankRecord = yield select(selectors.playerTank, playerName);
        if (!tank) continue;
        const { bullets }: State = yield select();
        const bulletCount = bullets.filter(b => b.tankId === tank.tankId).count();
        const canFire = bulletCount < getTankBulletLimit(tank) && tank.cooldown <= 0;
        noteChannel.put({
          type: 'query-result',
          result: {
            type: 'my-fire-info',
            bulletCount,
            canFire,
            cooldown: tank.cooldown
          }
        });
      }
    } else {
      throw new Error();
    }
  }

  function* getAIInput() {
    const tank = yield select(selectors.playerTank, playerName);
    if (tank == null) {
      return null;
    }

    if (nextDirection && tank.direction !== nextDirection) {
      const direction = nextDirection;
      nextDirection = null;
      forwardLength = 0;
      return { type: 'turn', direction };
    } else if (forwardLength > 0) {
      const { xy } = getDirectionInfo(tank.direction);
      const movedLength = Math.abs(tank.get(xy) - startPos);
      const maxDistance = forwardLength - movedLength;
      if (movedLength === forwardLength) {
        forwardLength = 0;
        noteChannel.put({ type: 'reach' });
        return null;
      } else {
        return {
          type: 'forward',
          maxDistance
        };
      }
    }
    return null;
  }
}

function* sendNotes(worker: Worker, noteChannel: Channel<Note>) {
  yield fork(function* sendNote() {
    while (true) {
      const note: Note = yield take(noteChannel);
      worker.postMessage(note);
    }
  });
}

interface WorkerConstructor {
  new (): Worker;
}

function* AIWorkerSaga(playerName: string, WorkerClass: WorkerConstructor) {
  const worker = new WorkerClass();
  try {
    const noteChannel = makeChannel<Note>();
    const cmdChannel = eventChannel<AICommand>(emitter => {
      const listener = (e: MessageEvent) => emitter(e.data);
      worker.addEventListener('message', listener);

      return () => worker.removeEventListener('message', listener);
    });

    yield all([handleCmds(playerName, cmdChannel, noteChannel), sendNotes(worker, noteChannel)]);
  } finally {
    worker.terminate();
  }
}

export default function* AIMasterSaga() {
  const max = 2;
  const taskMap: { [key: string]: Task } = {};

  const addAICommandChannel = makeChannel<'add'>();
  yield fork(addAIHandler);

  function* addAIHandler() {
    while (true) {
      yield take(addAICommandChannel);
      const {
        game: { remainingEnemies, currentStage }
      }: State = yield select();
      if (!remainingEnemies.isEmpty()) {
        const playerName = `AI-${getNextId('AI-player')}`;
        yield put<Action>({
          type: 'CREATE_PLAYER',
          player: PlayerRecord({
            playerName,
            lives: Infinity,
            side: 'ai'
          })
        });
        const { x, y } = yield select(selectors.availableSpawnPosition);
        yield put<Action>({ type: 'REMOVE_FIRST_REMAINING_ENEMY' });
        const level = remainingEnemies.first();
        const hp = level === 'armor' ? 4 : 1;
        const tankId = yield* spawnTank(
          TankRecord({
            x,
            y,
            side: 'ai',
            level,
            hp,
            withPowerUp: Math.random() < getWithPowerUpProbability(currentStage)
          }),
          0.6
        );
        taskMap[playerName] = yield spawn(AIWorkerSaga, playerName, AIWorker);

        yield put<Action.ActivatePlayerAction>({
          type: 'ACTIVATE_PLAYER',
          playerName,
          tankId
        });
      }
    }
  }

  while (true) {
    const action: Action = yield take(['KILL', 'START_STAGE', 'GAMEOVER']);
    if (action.type === 'START_STAGE') {
      for (let i = 0; i < max; i++) {
        addAICommandChannel.put('add');
      }
    } else if (action.type === 'KILL') {
      const {
        targetTank,
        targetPlayer: { playerName }
      } = action;

      if (targetTank.side === 'ai') {
        const task = taskMap[playerName];
        task.cancel();
        delete taskMap[playerName];
        yield put<Action>({ type: 'REMOVE_PLAYER', playerName });
        addAICommandChannel.put('add');
      }
    } else if (action.type === 'GAMEOVER') {
      for (const [playerName, task] of Object.entries(taskMap)) {
        task.cancel();
        delete taskMap[playerName];
        yield put<Action>({ type: 'REMOVE_PLAYER', playerName });
      }
    }
  }
}
