import { takeEvery, delay } from 'redux-saga';
import { fork, put } from 'redux-saga/effects';
import playerController from 'sagas/playerController';
import bulletsSaga from 'sagas/bulletsSaga';
import gameManager from 'sagas/gameManager';
import AIMasterSaga from 'sagas/AISaga';
import tickEmitter from 'sagas/tickEmitter';
import { CONTROL_CONFIG, TANK_SPAWN_DELAY } from 'utils/consts';

function* autoRemoveEffects() {
  yield takeEvery('SPAWN_EXPLOSION', function* removeExplosion({
    explosionId,
    explosionType
  }: Action.SpawnExplosionAction) {
    yield delay(explosionType === 'tank' ? 500 : 200);
    yield put({ type: 'REMOVE_EXPLOSION', explosionId });
  });
  yield takeEvery('SPAWN_FLICKER', function* removeFlicker({ flickerId }: Action.SpawnFlickerAction) {
    yield delay(TANK_SPAWN_DELAY);
    yield put({ type: 'REMOVE_FLICKER', flickerId });
  });
}

export default function* rootSaga() {
  yield fork(tickEmitter);

  yield fork(bulletsSaga);
  yield fork(autoRemoveEffects);

  yield fork(playerController, 'player-1', CONTROL_CONFIG.player1);
  yield fork(playerController, 'player-2', CONTROL_CONFIG.player2);

  yield fork(AIMasterSaga);

  yield fork(gameManager);
}
