import React from "react";

/*
 *  Screen imports
 */
import DrawerNavigator from "./navigation/drawerNavigator";

/*
 *  Redux imports
 */
import { createStore, combineReducers } from "redux";
import mazeReducer from "./store/reducers/mazeReducer";
import speedReducer from "./store/reducers/speedReducer";
import { Provider } from "react-redux";

const rootReducer = combineReducers({
  maze: mazeReducer,
  speed: speedReducer,
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <DrawerNavigator />
    </Provider>
  );
}
