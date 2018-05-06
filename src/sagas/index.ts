import { fork } from 'redux-saga/effects';
import playerController from 'sagas/playerController';
import bulletsSaga from 'sagas/bulletsSaga';
import gameManager from 'sagas/gameManager';
import AIMasterSaga from 'sagas/AISaga';
import playerSage from 'sagas/playerSaga';
import powerUps from 'sagas/powerUps';
import tickEmitter from 'sagas/tickEmitter';
import { CONTROL_CONFIG } from 'utils/consts';

export default function* rootSaga() {
  yield fork(tickEmitter);

  yield fork(bulletsSaga);
  yield fork(powerUps);

  yield fork(playerController, 'player-1', CONTROL_CONFIG.player1);
  yield fork(playerController, 'player-2', CONTROL_CONFIG.player2);

  yield fork(AIMasterSaga);
  yield fork(playerSage, 'player-1', 'yellow');

  yield fork(gameManager);
}
