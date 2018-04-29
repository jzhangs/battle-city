import { UP, DOWN, LEFT, BLOCK_SIZE } from 'utils/consts';

// Calculte bullet start postion according to postion and
// direction of tank.
export function getBulletStartPosition(x, y, direction) {
  switch (direction) {
    case UP:
      return { x: x + 6, y: y - 3 };
    case DOWN:
      return { x: x + 6, y: y + BLOCK_SIZE };
    case LEFT:
      return { x: x - 3, y: y + 6 };
    default:
      // RIGHT
      return { x: x + BLOCK_SIZE, y: y + 6 };
  }
}
