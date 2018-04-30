import React from 'react';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, BLOCK_SIZE, FIELD_BSIZE } from 'utils/consts';
import River from 'components/River';

const N = BLOCK_SIZE / ITEM_SIZE_MAP.RIVER * FIELD_BSIZE;

export default class RiverLayer extends React.PureComponent {
  render() {
    const { rivers } = this.props;

    return (
      <g data-role="river-layer">
        {rivers.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N);
            return <River key={t} x={col * ITEM_SIZE_MAP.RIVER} y={row * ITEM_SIZE_MAP.RIVER} />;
          }
            return null;
        })}
      </g>
    );
  }
}
