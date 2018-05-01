import { createStore, applyMiddleware } from 'redux';
import createSgaMiddleware from 'redux-saga';
import reducer from 'reducers';
import rootSaga from 'sagas';

const sagaMiddleware = createSgaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
