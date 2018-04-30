// { type: MOVE, direction: UP|DOWN|LEFT|RIGHT, distance }
export const MOVE = 'MOVE';

// { type: START_MOVE }
export const START_MOVE = 'START_MOVE';

// { type: STOP_MOVE }
export const STOP_MOVE = 'STOP_MOVE';

// { type: TICK, delta: <seconds-elapsed-since-last-tick> }
export const TICK = 'TICK';

// { type: AFTER_TICK, delta: <seconds-elapsed-since-last-tick> }
export const AFTER_TICK = 'AFTER_TICK';

// { type: ADD_BULLET, direction, speed, x, y, owner }
export const ADD_BULLET = 'ADD_BULLET';

// { type: DESTROY_BULLETS, owner }
export const DESTROY_BULLETS = 'DESTROY_BULLETS';

// { type: DESTROY_BRICKS, ts: <set-of-t> }
export const DESTROY_BRICKS = 'DESTROY_BRICKS';

export const DESTROY_STEELS = 'DESTROY_STEELS';

// { type: UPDATE_BULLETS, updatedBullets: <updated-bullets-map> }
export const UPDATE_BULLETS = 'UPDATE_BULLETS';

// { type: LOAD_STAGE, stage: <stage-configuration> }
export const LOAD_STAGE = 'LOAD_STAGE';

export const SPAWN_EXPLOSION = 'SPAWN_EXPLOSION';

export const REMOVE_EXPLOSION = 'REMOVE_EXPLOSION';

export const SPAWN_FLICKER = 'SPAWN_FLICKER';

export const REMOVE_FLICKER = 'REMOVE_FLICKER';

export const SPAWN_PLAYER = 'SPAWN_PLAYER';

export const DESTROY_EAGLE = 'DESTROY_EAGLE';
