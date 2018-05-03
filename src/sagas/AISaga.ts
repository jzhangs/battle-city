import { channel as makeChannel, Channel, eventChannel, Task } from 'redux-saga';
import { fork, put, select, take, spawn, all } from 'redux-saga/effects';

import directionController from 'sagas/directionController';
import fireController from 'sagas/fireController';
import inlineAI from 'sagas/inlineAI';
import * as selectors from 'utils/selectors';
import { getDirectionInfo, spawnTank } from 'utils/common';
import { State } from 'reducers';
import { TankRecord, PlayerRecord } from 'types';

const EmptyWorker = require('worker-loader!ai/emptyWorker');

function* handleReceiveMessages(playerName: string, cmdChannel: Channel<AICommand>, noteChannel: Channel<Note>) {
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
  yield fork(function* notifyWhenBulletComplete() {
    while (true) {
      const { bullets }: Action.DestroyBulletsAction = yield take('DESTROY_BULLETS');
      const tank = yield select(selectors.playerTank, playerName);
      if (tank != null) {
        if (bullets.some(b => b.tankId === tank.tankId)) {
          console.debug('bullet-completed. notify');
          noteChannel.put('bullet-complete');
        }
      }
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
        noteChannel.put('reach');
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

function* sendMessagesToWorker(worker: Worker, noteChannel: Channel<Note>) {
  yield fork(function* sendCommanActions() {
    while (true) {
      const action = yield take(
        (action: Action) =>
          action.type !== 'TICK' &&
          action.type !== 'AFTER_TICK' &&
          action.type !== 'MOVE' &&
          action.type !== 'UPDATE_BULLETS'
      );
      worker.postMessage(JSON.stringify(action));
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
    let postMessage = null;
    const cmdChannel = eventChannel<AICommand>(emitter => {
      const listener = (e: MessageEvent) => emitter(e.data);
      postMessage = emitter;
      worker.addEventListener('message', listener);

      return () => worker.removeEventListener('message', listener);
    });

    yield all([
      handleReceiveMessages(playerName, cmdChannel, noteChannel),
      inlineAI(playerName, postMessage, noteChannel),
      sendMessagesToWorker(worker, noteChannel)
    ]);
  } finally {
    worker.terminate();
  }
}

export default function* AIMasterSaga() {
  const taskMap: { [key: string]: Task } = {};

  let nextAIPlayerIndex = 0;

  function* addAI() {
    const {
      game: { remainingEnemies }
    }: State = yield select();
    if (!remainingEnemies.isEmpty()) {
      const playerName = `AI-${nextAIPlayerIndex++}`;
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
      const tankId = yield* spawnTank(
        TankRecord({ x, y, side: 'ai', color: 'silver', level: remainingEnemies.first() })
      );
      taskMap[playerName] = yield spawn(AIWorkerSaga, playerName, EmptyWorker);
      yield put<Action.ActivatePlayerAction>({
        type: 'ACTIVATE_PLAYER',
        playerName,
        tankId
      });
    }
  }

  while (true) {
    const action: Action = yield take(['KILL', 'LOAD_STAGE']);
    if (action.type === 'LOAD_STAGE') {
      yield* addAI();
      yield* addAI();
    } else if (action.type === 'KILL') {
      const { targetTank, targetPlayer } = action;
      if (targetTank.side === 'ai') {
        const task = taskMap[targetPlayer.playerName];
        task.cancel();
        delete taskMap[targetPlayer.playerName];
        yield* addAI();
      }
    }
  }
}
