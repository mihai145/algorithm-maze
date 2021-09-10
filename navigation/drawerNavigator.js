import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

/*
 *  Screen imports
 */
import settings from "../screens/settings";
import maze from "../screens/maze";

/*
 *  Drawer navigator export
 */
const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Maze">
        <Drawer.Screen
          name="Maze"
          component={maze}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Settings"
          component={settings}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
