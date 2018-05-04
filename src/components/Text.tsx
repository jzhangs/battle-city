import * as React from 'react';

type Chars = { [char: string]: (props: { fill: string }) => JSX.Element };

const chars: Chars = {
  ' ': () => <g data-role="character-blank" />,
  0: ({ fill }) => (
    <path
      data-role="character-0"
      fill={fill}
      d="M3,0 h3  v1  h1  v1  h1  v3  h-1 v1  h-1 v-4 h-1 v-1 h-2 v-1
         M6,7 h-3 v-1 h-1 v-1 h-1 v-3 h1  v-1 h1  v4  h1  v1  h2  v1"
    />
  ),
  1: ({ fill }) => <path data-role="character-1" fill={fill} d="M4,0 h2 v6 h2 v1 h-6 v-1 h2 v-4 h-1 v-1 h1 v-1" />,
  2: ({ fill }) => (
    <path
      data-role="character-2"
      fill={fill}
      d="M2,0 h5 v1 h1 v2 h-1 v1 h-1 v1 h-2 v1 h4 v1 h-7
        v-2 h1 v-1 h1 v-1 h2 v-1 h1 v-1 h-3 v1 h-2 v-1 h1 v-1"
    />
  ),
  3: ({ fill }) => (
    <path
      data-role="character-3"
      fill={fill}
      d="M2,0 h6 v1 h-1 v1 h-1 v1 h1 v1 h1 v2 h-1 v1 h-5
        v-1 h-1 v-1 h2 v1 h3 v-2 h-3 v-1 h1 v-1 h1 v-1 h-3 v-1"
    />
  ),
  4: ({ fill }) => (
    <path
      data-role="character-4"
      fill={fill}
      d="M4,0 h3 v4 h-2 v-2 h-1 v1 h-1 v1 h5 v1 h-1
        v2 h-2 v-2 h-4 v-2 h1 v-1 h1 v-1 h1 v-1"
    />
  ),
  5: ({ fill }) => (
    <path
      data-role="character-5"
      fill={fill}
      d="M1,0 h6 v1 h-4 v1 h4 v1 h1 v3 h-1 v1 h-5 v-1 h-1 v-1 h2 v1 h3 v-3 h-5 v-3"
    />
  ),
  6: ({ fill }) => (
    <path
      data-role="character-6"
      fill={fill}
      d="M3,0 h3 v1 h-2 v1 h-1 v4 h3 v-2 h-3 v-1 h4 v1 h1 v2 h-1 v1 h-5
        v-1 h-1 v-4 h1 v-1 h1 v-1"
    />
  ),
  7: ({ fill }) => (
    <path
      data-role="character-7"
      fill={fill}
      d="M1,0 h7 v2 h-1 v1 h-1 v1 h-1 v3 h-2 v-3 h1 v-1 h1 v-1 h1 v-1 h-3 v1 h-2 v-2"
    />
  ),
  8: ({ fill }) => (
    <g data-role="character-8" fill={fill}>
      <path d="M2,0 h4 v1 h-3 v1 h1 v1 h2 v1 h2 v2 h-1 v1 h-5 v-1 h4 v-1 h-2 v-1 h-2  v-1 h-1 v-2 h1 v-1" />
      <rect x={6} y={1} width={1} height={2} />
      <rect x={1} y={4} width={1} height={2} />
    </g>
  ),
  9: ({ fill }) => (
    <path
      data-role="character-9"
      fill={fill}
      d="M2,0 h5 v1 h1 v4 h-1 v1 h-1 v1 h-4 v-1 h3 v-1 h1 v-4 h-3 v2 h3 v1 h-4 v-1 h-1 v-2 h1 v-1"
    />
  ),
  a: ({ fill }) => (
    <g data-role="character-a" fill={fill}>
      <path d="M3,0 h3 v1 h1 v1 h1 v5 h-2 v-5 h-1 v-1 h-1 v1 h-1 v5 h-2 v-5 h1 v-1 h1 v-1" />
      <rect x={3} y={4} width={3} height={1} />
    </g>
  ),
  b: ({ fill }) => (
    <g data-role="character-b" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={3} y={0} width={4} height={1} />
      <rect x={3} y={3} width={4} height={1} />
      <rect x={3} y={6} width={4} height={1} />
      <rect x={6} y={1} width={2} height={2} />
      <rect x={6} y={4} width={2} height={2} />
    </g>
  ),
  c: ({ fill }) => (
    <path
      data-role="character-c"
      fill={fill}
      d="M3,0 h4 v1 h1 v1 h-2 v-1 h-2 v1 h-1 v3 h1 v1 h2 v-1 h2 v1 h-1 v1 h-4 v-1 h-1 v-1 h-1 v-3 h1 v-1 h1 v-1"
    />
  ),
  d: ({ fill }) => (
    <g data-role="character-d" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={3} y={0} width={3} height={1} />
      <rect x={5} y={1} width={2} height={1} />
      <rect x={6} y={2} width={2} height={3} />
      <rect x={5} y={5} width={2} height={1} />
      <rect x={3} y={6} width={3} height={1} />
    </g>
  ),
  e: ({ fill }) => (
    <g role="character-e" fill={fill}>
      <rect x={2} y={0} width={2} height={7} />
      <rect x={4} y={0} width={4} height={1} />
      <rect x={4} y={3} width={3} height={1} />
      <rect x={4} y={6} width={4} height={1} />
    </g>
  ),
  f: ({ fill }) => (
    <g data-role="character-f" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={3} y={0} width={5} height={1} />
      <rect x={3} y={3} width={4} height={1} />
    </g>
  ),
  g: ({ fill }) => (
    <path
      data-role="character-g"
      fill={fill}
      d="M3,0 h5 v1 h-4 v1 h-1 v3 h1 v1 h2 v-2 h-1 v-1 h3 v4 h-5 v-1 h-1 v-1 h-1 v-3 h1 v-1 h1 v-1"
    />
  ),
  h: ({ fill }) => (
    <g data-role="character-h" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={3} y={3} width={3} height={1} />
      <rect x={6} y={0} width={2} height={7} />
    </g>
  ),
  i: ({ fill }) => (
    <g data-role="character-i" fill={fill}>
      <rect x={2} y={0} width={6} height={1} />
      <rect x={4} y={1} width={2} height={5} />
      <rect x={2} y={6} width={6} height={1} />
    </g>
  ),
  j: ({ fill }) => (
    <g data-role="character-j" fill={fill}>
      <rect x={6} y={0} width={2} height={6} />
      <rect x={1} y={5} width={2} height={1} />
      <rect x={2} y={6} width={5} height={1} />
    </g>
  ),
  k: ({ fill }) => (
    <path
      data-role="character-k"
      fill={fill}
      d="M1,0 h2 v3 h1 v-1 h1 v-1 h1 v-1 h2 v1 h-1 v1 h-1 v1 h-1 v1 h1 v1 h1 v1 h1 v1 h-3 v-1 h-1 v-1 h-1 v2 h-2 v-7"
    />
  ),
  l: ({ fill }) => (
    <g data-role="character-l" fill={fill}>
      <rect x={2} y={0} width={2} height={6} />
      <rect x={2} y={6} width={6} height={1} />
    </g>
  ),
  m: ({ fill }) => (
    <path
      data-role="character-m"
      fill={fill}
      d="M1,0 h2 v1 h1 v1 h1 v-1 h1 v-1 h2 v7 h-2 v-3 h-1 v1 h-1 v-1 h-1 v3 h-2 v-7"
    />
  ),
  n: ({ fill }) => (
    <g data-role="character-n" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={6} y={0} width={2} height={7} />
      <rect x={3} y={1} width={1} height={2} />
      <rect x={4} y={2} width={1} height={2} />
      <rect x={5} y={3} width={1} height={2} />
    </g>
  ),
  o: ({ fill }) => (
    <g data-role="character-o" fill={fill}>
      <rect x={2} y={0} width={5} height={1} />
      <rect x={2} y={6} width={5} height={1} />
      <rect x={1} y={1} width={2} height={5} />
      <rect x={6} y={1} width={2} height={5} />
    </g>
  ),
  p: ({ fill }) => (
    <g data-role="character-p" fill={fill}>
      <rect x={1} y={0} width={2} height={7} />
      <rect x={3} y={0} width={4} height={1} />
      <rect x={3} y={4} width={4} height={1} />
      <rect x={6} y={1} width={2} height={3} />
    </g>
  ),
  q: ({ fill }) => (
    <path
      data-role="character-q"
      fill={fill}
      d="M2,0 h5 v1 h1 v4 h-1 v1 h1 v1 h-1 v-1 h-2 v-1 h-1 v-1 h2 v-3 h-3 v5 h3 v1 h-4 v-1 h-1 v-5 h1 v-1"
    />
  ),
  r: ({ fill }) => (
    <path
      data-role="character-r"
      fill={fill}
      d="M1,0 h6 v1 h1 v3 h-3 v-1 h1 v-2 h-3 v3 h3 v1 h1 v1 h1 v1 h-3 v-1 h-1 v-1 h-1 v2 h-2 v-7"
    />
  ),
  s: ({ fill }) => (
    <path
      data-role="character-s"
      fill={fill}
      d="M2,0 h4 v1 h1 v1 h-2 v-1 h-2 v2 h4 v1 h1 v2 h-1 v1
        h-5 v-1 h-1 v-1 h2 v1 h3 v-2 h-4 v-1 h-1 v-2 h1 v-1"
    />
  ),
  t: ({ fill }) => (
    <g data-role="character-t" fill={fill}>
      <rect x={2} y={0} width={6} height={1} />
      <rect x={4} y={1} width={2} height={6} />
    </g>
  ),
  u: ({ fill }) => (
    <g data-role="character-u" fill={fill}>
      <rect x={1} y={0} width={2} height={6} />
      <rect x={6} y={0} width={2} height={6} />
      <rect x={2} y={6} width={5} height={1} />
    </g>
  ),
  v: ({ fill }) => (
    <path
      data-role="character-v"
      fill={fill}
      d="M1,0 h2 v3 h1 v1 h1 v-1 h1 v-3 h2 v4 h-1 v1 h-1 v1 h-1 v1 h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-4"
    />
  ),
  w: ({ fill }) => (
    <path
      data-role="character-w"
      fill={fill}
      d="M1,0 h2 v3 h1 v-1 h1 v1 h1 v-3 h2 v7 h-2 v-1 h-1 v-1 h-1 v1 h-1 v1 h-2 v-7"
    />
  ),
  x: ({ fill }) => (
    <path
      data-role="character-x"
      fill={fill}
      d="M1,0 h2 v1 h1 v1 h1 v-1 h1 v-1 h2 v2 h-1 v1 h-1 v1 h1 v1 h1 v2
        h-2 v-1 h-1 v-1 h-1 v1 h-1 v1 h-2 v-2 h1 v-1 h1 v-1 h-1 v-1 h-1 v-2"
    />
  ),
  y: ({ fill }) => (
    <path data-role="character-y" fill={fill} d="M2,0 h2 v3 h2 v-3 h2 v3 h-1 v1 h-1 v3 h-2 v-3 h-1 v-1 h-1 v-3" />
  ),
  z: ({ fill }) => (
    <path
      data-role="character-z"
      fill={fill}
      d="M1,0 h7 v2 h-1 v1 h-1 v1 h-1 v1 h-1 v1 h4 v1 h-7 v-2 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h-4 v-1"
    />
  ),
  '-': ({ fill }) => <rect data-role="character-dash" fill={fill} x="1" y="3" width="6" height="2" />,
  '+': ({ fill }) => (
    <g data-role="character-plus" fill={fill}>
      <rect x="1" y="3" width="6" height="2" />
      <rect x="3" y="1" width="2" height="6" />
    </g>
  ),
  ':': ({ fill }) => (
    <g role="character-colon" fill={fill}>
      <rect x="2" y="1" width="2" height="2" />
      <rect x="2" y="5" width="2" height="2" />
    </g>
  ),
  '.': ({ fill }) => <rect role="character-dot" x="2" y="5" width="2" height="2" fill={fill} />,
  '?': ({ fill }) => (
    <g role="character-question-mark" fill={fill}>
      <path d="M2,0 h5 v1 h1 v2 h-1 v1 h-1 v1 h-3 v-1 h2 v-1 h1 v-2 h-3 v2 h-2 v-2 h1 v-1" />
      <rect x="3" y="6" width="3" height="1" />
    </g>
  ),
  ⅰ: ({ fill }) => (
    <path data-role="character-roman-numeral-one" fill={fill} d="M2,0 h4 v1 h-1 v5 h1 v1 h-4 v-1 h1 v-5 h-1 v-1" />
  ),
  ⅱ: ({ fill }) => (
    <g data-role="character-roman-numeral-two" fill={fill}>
      <rect x={2} y={0} width={5} height={1} />
      <rect x={3} y={1} width={1} height={5} />
      <rect x={5} y={1} width={1} height={5} />
      <rect x={2} y={6} width={5} height={1} />
    </g>
  ),
  ['\u2190'.toLowerCase()]: ({ fill }) => (
    <path
      data-role="character-leftwards-arrow"
      fill={fill}
      d="M1,3 h1 v-1 h1 v-1 h1 v-1 h1 v2 h3 v3 h-3 v2 h-1 v-1 h-1 v-1 h-1 v-1 h-1 v-1"
    />
  ),
  ['\u2192'.toLowerCase()]: ({ fill }) => (
    <path
      data-role="character-rightwards-arrow"
      fill={fill}
      d="M1,2 h3 v-2 h1 v1 h1 v1 h1 v1 h1 v1 h-1 v1 h-1 v1 h-1 v1 h-1 v-2 h-3 v-3"
    />
  ),
  ['\u00a9'.toLocaleLowerCase()]: ({ fill }) => (
    <g role="character-copyright-sign" fill={fill}>
      <rect x={2} y={0} width={4} height={1} />
      <rect x={2} y={7} width={4} height={1} />
      <rect x={0} y={2} width={1} height={4} />
      <rect x={7} y={2} width={1} height={4} />
      <rect x={1} y={1} width={1} height={1} />
      <rect x={6} y={1} width={1} height={1} />
      <rect x={1} y={6} width={1} height={1} />
      <rect x={6} y={6} width={1} height={1} />
      <path d="M3,2 h3 v1 h-3 v2 h3 v1 h-3 v-1 h-1 v-2 h1 v-1" />
    </g>
  )
};

type Props = {
  content: string;
  x: number;
  y: number;
  fill?: string;
  style?: React.CSSProperties;
};

export default class Text extends React.PureComponent<Props> {
  static support(char: string) {
    return char in chars;
  }

  render() {
    const { content, x, y, fill = 'white', style = {} } = this.props;
    return (
      <g data-role="text" transform={`translate(${x},${y})`} style={style}>
        {Array.from(content.toLowerCase()).map((char, i) => {
          const Component = chars[char];
          if (Component != null) {
            return (
              <g key={i} transform={`translate(${8 * i},0)`}>
                <Component fill={fill} />
              </g>
            );
          }
          console.warn(`Character '${char}' Not Implemented.`);
          return null;
        })}
      </g>
    );
  }
}
