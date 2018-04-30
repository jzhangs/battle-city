import React from 'react';
import Screen from 'components/Screen';
import { BLOCK_SIZE } from 'utils/consts';

const APP = () => (
  <svg width={15 * BLOCK_SIZE} height={15 * BLOCK_SIZE} style={{ background: 'grey' }}>
    <Screen />
  </svg>
);

export default APP;
