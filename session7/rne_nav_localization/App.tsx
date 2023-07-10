import React, { useContext, useEffect, useState } from "react";

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { ComponentDrawer } from "./src/components/ComponentDrawer";
import { ScreenHome } from './src/screens/ScreenHome';
import { ScreenHabitAdd } from './src/screens/ScreenHabitAdd';
import { ScreenSettings } from './src/screens/ScreenSettings';
import { ContextStrings, strings } from "./src/utils/strings";
import { Habit } from "./src/interfaces/habit";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// @ts-ignore
function HomeScreenWrapper() {
  let initialHabits: Habit[]= [{
    title: 'Habit 1',
    dateISO: new Date().toISOString(),
    id: uuidv4()
  }];

  return (<Drawer.Navigator
    initialRouteName='ScreenHome'
    drawerContent={(props) => <ComponentDrawer {...props} />}
  >
    <Drawer.Screen
      name="ScreenHome"
      component={ScreenHome}
      initialParams={{default_habits: initialHabits}}
      options={{
        title: strings.home_title
      }}
    />
    <Drawer.Screen
      name="ScreenSettings"
      component={ScreenSettings}
      options={{
        title: strings.settings_title
      }}
    />
  </Drawer.Navigator>);
}

// @ts-ignore
function AppStack() {
  return (<Stack.Navigator initialRouteName="ScreenHome">
    <Stack.Screen
      name="HomeScreenWrapper"
      component={HomeScreenWrapper}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="ScreenHabitAdd"
      component={ScreenHabitAdd}
      options={{
        title: strings.add_habit_title
      }}
    />
  </Stack.Navigator>);
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState(strings.getLanguage());

  return (<ContextStrings.Provider value={{
    currentLanguage: currentLanguage,
    setCurrentLanguage: setCurrentLanguage
  }}>
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>
  </ContextStrings.Provider>);
}

export default App;
