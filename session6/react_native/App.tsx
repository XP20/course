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

import DeviceInfo from "react-native-device-info";
import { ScreenUserRegister } from "./src/views/screens/ScreenUserRegister";
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
  // return <ScreenUserRegister/>;
  const [currentScreen, setCurrentScreen] = useState('ScreenUserRegisterHooks');

  return <View style={{flex: 1}}>
    {currentScreen == 'ScreenUserRegisterHooks' && <ScreenUserRegisterHooks
      default_email={'default@test.com'}
      onRegisterDone={() => {
        setCurrentScreen('ScreenUserPictureHooks');
      }}/>}
    {currentScreen == 'ScreenUserPictureHooks' && <ScreenUserPictureHooks />}
    <ComponentCalendar
      default_date={moment().format('YYYYMMDD')}
      onChangeDate={(date) => {console.log('Changed date to: ' + date)}}/>
  </View>

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [myDeviceId, setMyDeviceId] = useState('none');

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title={'test'}
            onPress={async () => {
              let uuid = await DeviceInfo.getUniqueId();
              setMyDeviceId(uuid);
              console.log('test', uuid); // Debug not working
            }}></Button>
          <Section title="Step One">
            My Device ID: <Text style={styles.highlight}>{myDeviceId}</Text>
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
