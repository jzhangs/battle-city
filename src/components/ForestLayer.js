import React from 'react';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import Forest from 'components/Forest';

export default class ForestLayer extends React.PureComponent {
  render() {
    const { forests } = this.props;
    return (
      <g data-role="forest-layer">
        {forests.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.FOREST);
            return <Forest key={t} x={col * ITEM_SIZE_MAP.FOREST} y={row * ITEM_SIZE_MAP.FOREST} />;
          }
            return null;
        })}
      </g>
    );
  }
}
