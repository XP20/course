/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DarkTheme } from '@react-navigation/native';
import { ScreenRotation } from "./src/screens/ScreenRotation";
import { ScreenPicker } from "./src/screens/ScreenPicker";

const Stack = createNativeStackNavigator();

const App = () => {
  return (<NavigationContainer theme={DarkTheme}>
    <Stack.Navigator>
      <Stack.Screen
        name="Picker"
        component={ScreenPicker}
        options={{
          title: 'Image Picker'
      }} />
      <Stack.Screen
        name="Rotation"
        component={ScreenRotation}
        options={{
          title: 'Rotation Aligner'
      }} />
    </Stack.Navigator>
  </NavigationContainer>);
}

export default App;
