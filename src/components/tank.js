import React from 'react';
import * as _ from 'lodash';
import { Pixel, Bitmap } from 'components/elements';
import { TANK_COLOR_SCHEMES, UP, DOWN, LEFT, BLOCK_SIZE } from 'utils/consts';

class Tank extends React.Component {
  static defaultProps = {
    moving: false
  };

  constructor(props) {
    super(props);
    this.handle = null;
    this.state = {
      shape: 0
    };
  }

  componentDidMount() {
    if (this.props.moving) {
      this.handle = setInterval(() => {
        this.setState({ shape: this.state.shape + 1 });
      }, 250);
    }
  }

  componentWillUnmount() {
    clearInterval(this.handle);
  }

  render() {
    const { x, y, color, level, direction } = this.props;
    let rotate;
    let dx;
    let dy;
    if (direction === UP) {
      dx = x;
      dy = y;
      rotate = 0;
    } else if (direction === DOWN) {
      dx = x + BLOCK_SIZE - 1;
      dy = y + BLOCK_SIZE;
      rotate = 180;
    } else if (direction === LEFT) {
      dx = x;
      dy = y + BLOCK_SIZE - 1;
      rotate = -90;
    } else {
      // RIGHT
      dx = x + BLOCK_SIZE;
      dy = y;
      rotate = 90;
    }
    if (level === 0) {
      return (
        <TankLevel0
          x={x}
          y={y}
          transform={`translate(${dx}, ${dy})rotate(${rotate})`}
          color={color}
          shape={this.state.shape % 2}
        />
      );
    }
    // TODO complete level 1~7
    return null;
  }
}

const TankLevel0 = ({ transform, color, shape }) => {
  const scheme = TANK_COLOR_SCHEMES[color];
  const { a, b, c } = scheme;
  return (
    <g data-role="tank" transform={transform}>
      <g data-role="left-tire">
        <rect x={1} y={5} width={3} height={9} fill={a} />
        <rect x={2} y={5} width={1} height={9} fill={b} />
        {shape === 0 ? (
          <g data-role="left-tire-shape-0">
            <Bitmap x={1} y={4} d={['abb']} scheme={scheme} />
            <Bitmap x={1} y={14} d={['abb']} scheme={scheme} />
            {_.range(5).map(i => (
              <rect key={i} x={1} width={2} y={5 + 2 * i} height={1} fill={c} />
            ))}
          </g>
        ) : (
          <g data-role="left-tire-shape-1">
            <Bitmap x={1} y={4} d={['acc']} scheme={scheme} />
            <Bitmap x={1} y={14} d={['bcc']} scheme={scheme} />
            {_.range(4).map(i => (
              <rect key={i} x={1} width={2} y={6 + 2 * i} height={1} fill={c} />
            ))}
          </g>
        )}
      </g>

      <g data-role="right-tire">
        <rect x={11} y={4} width={3} height={11} fill={c} />
        <Pixel x={11} y={4} fill={a} />

        {shape === 0 ? (
          <g rdata-ole="right-tire-shape-0">
            {_.range(6).map(i => (
              <rect key={i} x={12} width={2} y={4 + 2 * i} height={1} fill={b} />
            ))}
          </g>
        ) : (
          <g data-role="right-tire-shape-1">
            {_.range(5).map(i => (
              <rect key={i} x={12} width={2} y={5 + 2 * i} height={1} fill={b} />
            ))}
          </g>
        )}
      </g>

      <g data-role="tank-body">
        <path d="M4,7 h1 v-1 h1 v2 h-1 v3 h1 v1 h1 v1 h-2 v-1 h-1 v-5" fill={a} />
        <Pixel x={4} y={12} fill={c} />
        <path d="M6,6 h1 v1 h3 v1 h1 v4 h-1 v1 h-3 v-1 h-1 v-1 h-1 v-3 h1 v-2" fill={b} />
        <Pixel x={10} y={12} fill={c} />
        <rect x={5} y={13} width={5} height={1} fill={c} />
        <rect x={8} width={2} y={6} height={1} fill={c} />
        <Pixel x={10} y={7} fill={c} />
        <path d="M6,8 h2 v1 h-1 v2 h-1 v-3" fill={a} />
        <path d="M8,9 h1 v3 h-2 v-1 h1 v-2" fill={c} />
      </g>
      <rect data-role="gun" x={7} y={2} width={1} height={5} fill={a} />
    </g>
  );
};

export default Tank;
