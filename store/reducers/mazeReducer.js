import {
  DESTINATION_ADDITIVE_CT,
  DISTANCE_ADDITIVE_CT,
} from "../../constants/constants";
import {
  CLEAR_MAZE,
  MODIFY_DIMENSIONS,
  SET_END,
  SET_EXPANDED,
  SET_START,
  TOGGLE_OBSTACLE,
} from "../actions/mazeSettings";

export const generateEmptyMatrix = (n, m) => {
  let matrix = [];

  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < m; j++) {
      row.push(0);
    }

    matrix.push(row);
  }

  return matrix;
};

const initialState = {
  n: 8,
  m: 8,
  maze: generateEmptyMatrix(8, 8),
};

const mazeReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODIFY_DIMENSIONS: {
      return {
        n: action.n,
        m: action.m,
        maze: generateEmptyMatrix(action.n, action.m),
      };
    }
    case CLEAR_MAZE: {
      let updatedMaze = [...state.maze];
      for (let i = 0; i < state.n; i++) {
        for (let j = 0; j < state.m; j++) {
          if (
            updatedMaze[i][j] > DISTANCE_ADDITIVE_CT &&
            updatedMaze[i][j] < DESTINATION_ADDITIVE_CT
          ) {
            updatedMaze[i][j] = 0;
          }
          if (updatedMaze[i][j] === DISTANCE_ADDITIVE_CT) {
            updatedMaze[i][j] = 2;
          }
          if (updatedMaze[i][j] > DESTINATION_ADDITIVE_CT) {
            updatedMaze[i][j] = 3;
          }
        }
      }
      return {
        n: state.n,
        m: state.m,
        maze: updatedMaze,
      };
    }
    case TOGGLE_OBSTACLE: {
      let updatedMaze = [...state.maze];
      if (updatedMaze[action.x][action.y] !== 1) {
        updatedMaze[action.x][action.y] = 1;
      } else {
        updatedMaze[action.x][action.y] = 0;
      }
      return {
        n: state.n,
        m: state.m,
        maze: updatedMaze,
      };
    }
    case SET_START: {
      let updatedMaze = [...state.maze];
      for (let i = 0; i < state.n; i++) {
        for (let j = 0; j < state.m; j++) {
          if (updatedMaze[i][j] === 2) {
            updatedMaze[i][j] = 0;
          }
        }
      }
      updatedMaze[action.x][action.y] = 2;
      return {
        n: state.n,
        m: state.m,
        maze: updatedMaze,
      };
    }
    case SET_END: {
      let updatedMaze = [...state.maze];
      for (let i = 0; i < state.n; i++) {
        for (let j = 0; j < state.m; j++) {
          if (updatedMaze[i][j] === 3) {
            updatedMaze[i][j] = 0;
          }
        }
      }
      updatedMaze[action.x][action.y] = 3;
      return {
        n: state.n,
        m: state.m,
        maze: updatedMaze,
      };
    }
    case SET_EXPANDED: {
      let updatedMaze = [...state.maze];
      updatedMaze[action.x][action.y] = action.d;
      return {
        n: state.n,
        m: state.m,
        maze: updatedMaze,
      };
    }
    default:
      return state;
  }
};

export default mazeReducer;
