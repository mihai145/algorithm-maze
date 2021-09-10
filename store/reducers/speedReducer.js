import { NORMAL, SET_SPEED } from "../actions/speedSettings";

const initialState = {
  speed: NORMAL,
};

const speedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPEED: {
      return {
        speed: action.speed,
      };
    }
    default: {
      return state;
    }
  }
};

export default speedReducer;
