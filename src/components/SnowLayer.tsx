import * as React from 'react';
import { List } from 'immutable';
import { getRowCol } from 'utils/common';
import { ITEM_SIZE_MAP, N_MAP } from 'utils/consts';
import Snow from 'components/Snow';

type P = {
  snows: List<boolean>,
};

export default class SnowLayer extends React.PureComponent<P, {}> {
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
