import { Image, StyleSheet, View } from "react-native";
import SvgAvailability from "../../assets/svg/SvgAvailability";
import React from "react";

const AVAILABILITY_RASTER_PATH = './src/assets/images/Availability.png';

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

export const ComponentHistogram = () => {
  return (<View style={styles.view}>
    <Image
      source={require(AVAILABILITY_RASTER_PATH)}
      style={styles.asset}
    />
    <SvgAvailability width={300} height={300} />
  </View>);
};
