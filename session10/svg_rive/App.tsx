import React, { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenSVG } from "./src/views/screens/ScreenSVG";
import { ScreenRive } from "./src/views/screens/ScreenRive";
import { ScreenHistogram } from "./src/views/screens/ScreenHistogram";
import { ScreenGraph } from "./src/views/screens/ScreenGraph";
import { ScreenHome } from "./src/views/screens/ScreenHome";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={ScreenHome}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name='SVG'
          component={ScreenSVG}
          options={{title: 'Raster vs SVG'}}
        />
        <Stack.Screen
          name='Histogram'
          component={ScreenHistogram}
          options={{title: 'CSV Histogram'}}
        />
        <Stack.Screen
          name='Rive'
          component={ScreenRive}
          options={{title: 'Rive'}}
        />
        <Stack.Screen
          name='Graph'
          component={ScreenGraph}
          options={{title: 'Victory Graph'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
