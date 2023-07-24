import React, { useEffect, useState } from "react";
import { Animated, Button, Image, StyleSheet, Text, View } from "react-native";
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
import { orientation, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DarkTheme } from '@react-navigation/native';
import { Rotation } from "../interfaces/Rotation";
import { Quaternion } from "../interfaces/Quaternion";

const TOLERANCE_ANGLE = 3;
const FRACTIONS_SHOWN = 0;
const EXPECTED_ROLL_ANGLE = 90;
const EXPECTED_PITCH_ANGLE = 0;

const styles = StyleSheet.create ({
  view: {
    padding: 30
  },
  image: {
    width: 256,
    height: 256
  },
  flex_view: {
    flex: 1
  },
  text_roll: {
    width: '100%',
    textAlign: 'right',
    fontSize: 40,
    zIndex: 30,
    flex: 1
  },
  roll_container: {
    marginTop: '60%',
    display: 'flex',
    flexDirection: 'row'
  },
  roll_target: {
    height: 2,
    backgroundColor: 'white',
    zIndex: 20,
    width: '300%',
    left: '-100%'
  },
  pitch_target: {
    height: 2,
    backgroundColor: 'white',
    zIndex: 20
  },
  text_pitch: {
    position: 'absolute',
    zIndex: 30,
    fontSize: 40,
    textAlign: 'center',
    width: '100%',
    marginTop: 24
  }
});

//@ts-ignore
export const ScreenRotation = ({navigation}) => {
  let defaultRotation: Rotation = { pitch: 0, roll: 0, yaw: 0 };
  const [rotation, setRotation] = useState(defaultRotation);

  const quaternionToAngles = (q: Quaternion) => {
    let data = q;

    let ysqr = data.y * data.y;
    let t0 = -2.0 * (ysqr + data.z * data.z) + 1.0;
    let t1 = +2.0 * (data.x * data.y + data.w * data.z);
    let t2 = -2.0 * (data.x * data.z - data.w * data.y);
    let t3 = +2.0 * (data.y * data.z + data.w * data.x);
    let t4 = -2.0 * (data.x * data.x + ysqr) + 1.0;

    t2 = t2 > 1.0 ? 1.0 : t2;
    t2 = t2 < -1.0 ? -1.0 : t2;

    const toDeg = 180 / Math.PI;

    const euler: Rotation = { pitch: 0, roll: 0, yaw: 0 };
    euler.pitch = Math.asin(t2) * toDeg;
    euler.roll = Math.atan2(t3, t4) * toDeg;
    euler.yaw = Math.atan2(t1, t0) * toDeg;

    return euler;
  }

  setUpdateIntervalForType(SensorTypes.orientation, 10);

  useEffect(() => {
    const subscription = orientation.subscribe(({ qx, qy, qz, qw }) => {
      let q: Quaternion = { x: qx, y: qy, z: qz, w: qw };
      let euler = quaternionToAngles(q);
      setRotation(euler);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getColorFromAngle = (angle: number, expected_angle: number) => {
    let color: string;
    if (Math.abs(angle - expected_angle) <= TOLERANCE_ANGLE) {
      color = 'rgba(0, 255, 0, 0.5)';
    } else {
      color = 'rgba(255, 0, 0, 0.5)';
    }
    return color;
  }

  let pitchRotation = -1 * (rotation.pitch - EXPECTED_PITCH_ANGLE);
  let pitchColor = getColorFromAngle(rotation.pitch, EXPECTED_PITCH_ANGLE);
  let pitchString = rotation.pitch.toFixed(FRACTIONS_SHOWN);

  let rollPosition = rotation.roll - EXPECTED_ROLL_ANGLE - (2 + TOLERANCE_ANGLE);
  let rollColor = getColorFromAngle(rotation.roll, EXPECTED_ROLL_ANGLE);
  let rollString = rotation.roll.toFixed(FRACTIONS_SHOWN);

  return (<View style={styles.view}>
    <View style={styles.roll_container}>
      <View style={styles.flex_view} />
      <View style={styles.flex_view}>
        <View style={styles.roll_target} />
        <Animated.View style={{
          transform: [{
            translateY: rollPosition
          }]
        }}>
          <View
            style={{
              zIndex: 40,
              width: '100%',
              height: (1 + TOLERANCE_ANGLE) * 2,
              backgroundColor: rollColor,
            }}
          />
        </Animated.View>
      </View>
      <Text style={styles.text_roll}>
        {`${rollString}°`}
      </Text>
    </View>
    <View style={{ marginTop: '80%' }}>
      <View style={styles.pitch_target} />
      <Text style={styles.text_pitch}>
        {`${pitchString}°`}
      </Text>
      <Animated.View style={{
        transform: [{
          rotate: `${pitchRotation.toFixed(2)}deg`
        }]
      }}>
        <View style={{
          zIndex: 10,
          left: '-250%',
          width: 5000,
          height: 512,
          backgroundColor: pitchColor,
        }} />
      </Animated.View>
    </View>
  </View>);
}
