import * as React from 'react';
import Text from 'components/Text';
import { TextsMap } from 'types';

export default class TextLayer extends React.PureComponent<{ texts: TextsMap }, {}> {
  render() {
    const { texts } = this.props;

    return (
      <g data-role="text-layer">
        {texts
          .map(t => <Text key={t.textId} content={t.content} fill={t.fill} x={t.x} y={t.y} />)
          .toArray()}
      </g>
    );
  }
}
