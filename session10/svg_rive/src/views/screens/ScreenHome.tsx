import { Button, StyleSheet, View } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asset: {
    width: 300,
    height: 300,
  }
});

//@ts-ignore
export const ScreenHome = ({ navigation }) => {
  return (<View style={styles.view}>
    <Button
      title='SVG Screen'
      onPress={() => {
        navigation.navigate('SVG');
      }}
    />
    <Button
      title='Histogram Screen'
      onPress={() => {
        navigation.navigate('Histogram');
      }}
    />
    <Button
      title='Rive Screen'
      onPress={() => {
        navigation.navigate('Rive');
      }}
    />
    <Button
      title='Graph Screen'
      onPress={() => {
        navigation.navigate('Graph');
      }}
    />
  </View>);
};
