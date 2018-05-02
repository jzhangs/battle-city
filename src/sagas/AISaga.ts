import { channel as makeChannel, Channel, eventChannel, Task } from 'redux-saga';
import { fork, put, select, take, spawn, all } from 'redux-saga/effects';

import directionController from 'sagas/directionController';
import fireController from 'sagas/fireController';
import inlineAI from 'sagas/inlineAI';
import * as selectors from 'utils/selectors';
import { getDirectionInfo, spawnTank } from 'utils/common';
import { State } from 'reducers';

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
      game: { remainingEnemyCount }
    }: State = yield select();
    if (remainingEnemyCount > 0) {
      const playerName = `AI-${nextAIPlayerIndex++}`;
      yield put({
        type: 'CREATE_PLAYER',
        playerName,
        lives: Infinity
      });

      const { x, y } = yield select(selectors.avaliableSpawnPosition);
      yield put({ type: 'DECREMENT_ENEMY_COUNT' });
      const tankId = yield* spawnTank({ x, y, side: 'ai' });
      taskMap[playerName] = yield spawn(AIWorkerSaga, playerName, EmptyWorker);
      yield put<Action.ActivatePlayerAction>({
        type: 'ACTIVATE_PLAYER',
        playerName,
        tankId
      });
    }
  }

  while (true) {
    const action: Action = yield take(['REMOVE_TANK', 'LOAD_STAGE']);
    if (action.type === 'LOAD_STAGE') {
      yield all([addAI(), addAI()]);
    } else if (action.type === 'REMOVE_TANK') {
      for (const [playerName, task] of Object.entries(taskMap)) {
        const AITank = yield select(selectors.playerTank, playerName);
        if (AITank === null) {
          task.cancel();
          delete taskMap[playerName];
          yield* addAI();
        }
      }
    }
  }
}

declare global {
  interface Window {
    go: any;
    fire: any;
    idle: any;
    $$postMessage: any;
  }
}

function injectDebugUtils(emitter: any) {
  window.go = (x: number, y: number) => emitter({ type: 'move', x, y });
  window.fire = () => emitter({ type: 'fire' });
  window.idle = () => emitter({ type: 'idle' });
  setTimeout(() => {
    const arena = document.querySelector('[role=battle-field]');
    arena.addEventListener('click', (event: MouseEvent) => {
      const rect = arena.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const flr = (xxx: number) => Math.floor(xxx / 8) * 8;
      window.go(flr(x - 4), flr(y - 4));
    });
    let firing = false;
    arena.addEventListener('contextmenu', event => {
      event.preventDefault();
      if (firing) {
        window.idle();
        firing = true;
      } else {
        window.fire();
        firing = false;
      }
    });
  }, 100);
}
