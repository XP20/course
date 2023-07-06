/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { ScreenUserRegisterHooks } from "./src/views/screens/ScreenUserRegisterHooks";
import { ScreenUserPictureHooks } from "./src/views/screens/ScreenUserPictureHooks";
import { ComponentCalendar } from "./src/views/components/ComponentCalendar";
import moment from "moment";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState('ScreenUserRegisterHooks');

  return <View style={{flex: 1}}>
    <Text>Test</Text>
    {currentScreen == 'ScreenUserRegisterHooks' && <ScreenUserRegisterHooks
      default_email={'default@test.com'}
      onRegisterDone={() => {
        setCurrentScreen('ScreenUserPictureHooks');
      }}/>}
    {currentScreen == 'ScreenUserPictureHooks' && <ScreenUserPictureHooks />}
    <ComponentCalendar
      default_date={moment()}
      onChangeDate={(date) => {console.log('Changed date to: ' + date.format('YYYYMMDD'))}}/>
  </View>
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
