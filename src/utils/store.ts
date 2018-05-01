import { createStore, applyMiddleware } from 'redux';
import createSgaMiddleware from 'redux-saga';
import reducers from 'reducers';
import sagas from 'sagas';

const sagaMiddleware = createSgaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas);

export default store;
