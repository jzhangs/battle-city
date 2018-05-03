import * as React from 'react';
import Screen from 'components/Screen';
import { BLOCK_SIZE } from 'utils/consts';

const App = () => (
  <svg className="svg" width={16 * BLOCK_SIZE} height={15 * BLOCK_SIZE} >
    <Screen />
  </svg>
);

export default App;
