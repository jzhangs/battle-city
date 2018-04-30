// 16px for a block
export const BLOCK_SIZE = 16;

// field size - (13block * 13block)
export const FIELD_BLOCK_SIZE = 13;

export const FIELD_SIZE = BLOCK_SIZE * FIELD_BLOCK_SIZE;

export const BULLET_SIZE = 3;

export const TANK_SPAWN_DELAY = 1500;

export const TANK_COLOR_SCHEMES = {
  yellow: {
    a: '#E7E794',
    b: '#E79C21',
    c: '#6B6B00'
  },
  green: {
    a: '#B5F7CE',
    b: '#008C31',
    c: '#005200'
  },
  silver: {
    a: '#FFFFFF',
    b: '#ADADAD',
    c: '#00424A'
  },
  red: {
    a: '#FFFFFF',
    b: '#B53121',
    c: '#5A007B'
  }
};

export const UP = 'UP';
export const DOWN = 'DOWN';
export const RIGHT = 'RIGHT';
export const LEFT = 'LEFT';

export const DIRECTION_MAP = {
  [UP]: ['y', 'dec'],
  [DOWN]: ['y', 'inc'],
  [LEFT]: ['x', 'dec'],
  [RIGHT]: ['x', 'inc']
};

export const ITEM_SIZE_MAP = {
  BRICK: 4,
  STEEL: 8,
  RIVER: BLOCK_SIZE,
  SNOW: BLOCK_SIZE,
  FOREST: BLOCK_SIZE
};

export const N_MAP = {
  BRICK: FIELD_SIZE / ITEM_SIZE_MAP.BRICK,
  STEEL: FIELD_SIZE / ITEM_SIZE_MAP.STEEL,
  RIVER: FIELD_SIZE / ITEM_SIZE_MAP.RIVER,
  SNOW: FIELD_SIZE / ITEM_SIZE_MAP.SNOW,
  FOREST: FIELD_SIZE / ITEM_SIZE_MAP.FOREST
};
