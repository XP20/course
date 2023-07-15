import React, { useContext } from "react";
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ContextStrings, strings } from "../utils/strings";
import { Icon, Button } from "@rneui/themed";

export function ScreenSettings() {
  const navigation = useNavigation();
  const { currentLanguage, setCurrentLanguage } = useContext(ContextStrings);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => {
        strings.setLanguage('lv');
        setCurrentLanguage(strings.getLanguage())
      }}>
        {strings.button_switch_latvian}
      </Button>
      <Button onPress={() => {
        strings.setLanguage('en');
        setCurrentLanguage(strings.getLanguage())
      }}>
        {strings.button_switch_english}
      </Button>
      <Button title={strings.button_back} onPress={() => {
        navigation.goBack();
      }} />
    </View>
  );
}
