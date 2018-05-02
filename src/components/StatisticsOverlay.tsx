import * as React from 'react';
import Text from 'components/Text';
import Tank from 'components/Tank';
import { BLOCK_SIZE as B } from 'utils/consts';

export default class StatisticsOverlay extends React.PureComponent {
  render() {
    return (
      <g data-role="statistics-overlay">
        <rect fill="#000" x={0} y={0} width={16 * B} height={16 * B} />
        <g transform={`translate(${-0.5 * B}, ${-1.5 * B})`}>
          <Text content="HI-SCORE" x={4.5 * B} y={3.5 * B} fill="#e44437" />
          <Text content="20000" x={10 * B} y={3.5 * B} fill="#feac4e" />
          <Text content="STAGE  test" x={6.5 * B} y={4.5 * B} fill="#fff" />
          <Text content={'PLAYER ⅰ'} x={2 * B} y={5.5 * B} fill="#e44437" />
          <Text content="3200" x={4 * B} y={6.5 * B} fill="#feac4e" />
          <Text content={'1800 PTS 18\u2190'} x={2 * B} y={8 * B} fill="white" />
          <Tank x={8 * B} y={7.7 * B} color="silver" level={4} direction="up" moving={false} />
          <Text content={'400 PTS  2\u2190'} x={2.5 * B} y={9.5 * B} fill="white" />
          <Tank x={8 * B} y={9.2 * B} color="silver" level={5} direction="up" moving={false} />
          <Text content={'  0 PTS  2\u2190'} x={2.5 * B} y={11 * B} fill="white" />
          <Tank x={8 * B} y={10.7 * B} color="silver" level={6} direction="up" moving={false} />
          <Text content={'  0 PTS  0\u2190'} x={2.5 * B} y={12.5 * B} fill="white" />
          <Tank x={8 * B} y={12.2 * B} color="silver" level={7} direction="up" moving={false} />
          <rect x={6.5 * B} y={13.3 * B} width={4 * B} height={2} fill="white" />
          <Text content="TOTAL 20" x={3.5 * B} y={13.5 * B} fill="white" />
        </g>
      </g>
    );
  }
}
