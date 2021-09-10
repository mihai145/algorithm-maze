export const SLOW = 0;
export const NORMAL = 1;
export const FAST = 2;

export const SET_SPEED = "SET_SPEED";

export const setSpeed = (speed) => {
  return {
    type: SET_SPEED,
    speed: speed,
  };
};
