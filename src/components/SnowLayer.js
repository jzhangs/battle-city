import React from 'react';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import Snow from 'components/Snow';

export default class SnowLayer extends React.PureComponent {
  render() {
    const { snows } = this.props;

    return (
      <g data-role="snow-layer">
        {snows.map((set, t) => {
          if (set) {
            const [row, col] = getRowCol(t, N_MAP.SNOW);
            return <Snow key={t} x={col * ITEM_SIZE_MAP.SNOW} y={row * ITEM_SIZE_MAP.SNOW} />;
          }
          return null;
        })}
      </g>
    );
  }
}
