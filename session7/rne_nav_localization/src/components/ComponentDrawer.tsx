import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from "@react-navigation/native";
import { strings } from "../utils/strings";
import { Icon } from "@rneui/themed";
import React from "react";

// @ts-ignore
export function ComponentDrawer(props) {
  const navigation = useNavigation();

  return (<DrawerContentScrollView>
    <DrawerItem
      label={strings.home_title}
      onPress={() => {
          // @ts-ignore
          navigation.navigate('ScreenHome');
      }}
      icon={({ focused, color, size }) =>
        <Icon
          color={color}
          size={size}
          name={'home'}
      />}
    />
    <DrawerItem
      label={strings.settings_title}
      onPress={() => {
        // @ts-ignore
        navigation.navigate('ScreenSettings');
      }}
      icon={({ focused, color, size }) =>
        <Icon
          color={color}
          size={size}
          name={'settings'}
      />}
    />
  </DrawerContentScrollView>);
}
