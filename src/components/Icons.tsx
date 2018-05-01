import * as React from 'react';

export default class PlayerTankThumbnail extends React.PureComponent<Point> {
  render() {
    const { x, y } = this.props;
    return (
      <path
        data-role="player-tank-thumbnail"
        transform={`translate(${x},${y})`}
        fill="#9c4a00"
        d="M1,1 h1 v2 h1 v-1 h1 v-1 h-1 v-1 h3 v1 h-1 v1 h1 v1
        h1 v-2 h1 v7 h-1 v-2 h-1 v-2 h-1 v-1 h-1 v1 h-1 v1 h1
        v1 h1 v-1 h1 v2 h-1 v1 h-1 v-1 h-1 v-1 h-1 v2 h-1 v-7"
      />
    );
  }
}
