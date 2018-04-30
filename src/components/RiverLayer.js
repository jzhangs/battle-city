import React from 'react';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import River from 'components/River';

export default class RiverLayer extends React.PureComponent {
  render() {
    const { rivers } = this.props;

    return (
      <g data-role="river-layer">
        {rivers.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.RIVER);
            return <River key={t} x={col * ITEM_SIZE_MAP.RIVER} y={row * ITEM_SIZE_MAP.RIVER} />;
          }
            return null;
        })}
      </g>
    );
  }
}
