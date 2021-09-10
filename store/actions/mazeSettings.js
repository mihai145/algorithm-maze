export const MODIFY_DIMENSIONS = "MODIFY_DIMENSIONS";
export const CLEAR_MAZE = "CLEAR_MAZE";

export const TOGGLE_OBSTACLE = "TOGGLE_OBSTACLE";
export const SET_START = "SET_START";
export const SET_END = "SET_END";
export const SET_EXPANDED = "SET_EXPANDED";

export const modifyDimensions = (n, m) => {
  return {
    type: MODIFY_DIMENSIONS,
    n: n,
    m: m,
  };
};

export const clearMaze = () => {
  return {
    type: CLEAR_MAZE,
  };
};

export const toggleObstacle = (x, y) => {
  return {
    type: TOGGLE_OBSTACLE,
    x: x,
    y: y,
  };
};

export const setStart = (x, y) => {
  return {
    type: SET_START,
    x: x,
    y: y,
  };
};

export const setEnd = (x, y) => {
  return {
    type: SET_END,
    x: x,
    y: y,
  };
};

export const setExpanded = (x, y, d) => {
  return {
    type: SET_EXPANDED,
    x: x,
    y: y,
    d: d,
  };
};
