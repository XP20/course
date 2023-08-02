import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, Image, StyleSheet, Text, View } from "react-native";
import { orientation, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import { Subscription } from "rxjs";
import { Euler, Quaternion } from 'three';
import { OrientationArgs } from "../interfaces/OrientationArgs";

const TOLERANCE_ANGLE = 3;
const FRACTIONS_SHOWN = 0;
const EXPECTED_ROLL_ANGLE = 90;
const EXPECTED_PITCH_ANGLE = 0;

const styles = StyleSheet.create({
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
    width: "100%",
    textAlign: "right",
    fontSize: 40,
    zIndex: 30,
    flex: 1
  },
  roll_container: {
    marginTop: "60%",
    display: "flex",
    flexDirection: "row"
  },
  roll_target: {
    height: 2,
    backgroundColor: "white",
    zIndex: 20,
    width: "300%",
    left: "-100%"
  },
  pitch_target: {
    height: 2,
    backgroundColor: "white",
    zIndex: 20
  },
  text_pitch: {
    position: "absolute",
    zIndex: 30,
    fontSize: 40,
    textAlign: "center",
    width: "100%",
    marginTop: 24
  }
});

//@ts-ignore
export const ScreenRotation = ({ navigation }) => {
  let defaultRotation = new Euler(0, 0, 0);
  const [rotation, setRotation] = useState(defaultRotation);

  setUpdateIntervalForType(SensorTypes.orientation, 10);

  const orientationCallback = (q: OrientationArgs) => {
    let threeQ = new Quaternion(q.qx, q.qy, q.qz, q.qw);
    let euler = new Euler().setFromQuaternion(threeQ);
    setRotation(euler);
  };

  let subscription: Subscription;
  useEffect(() => {
    subscription = orientation.subscribe(orientationCallback);

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

  let pitchRotation = -1 * (rotation.x - EXPECTED_PITCH_ANGLE);
  let pitchColor = getColorFromAngle(rotation.x, EXPECTED_PITCH_ANGLE);
  let pitchString = rotation.x.toFixed(FRACTIONS_SHOWN);

  let rollPosition = rotation.y - EXPECTED_ROLL_ANGLE - (2 + TOLERANCE_ANGLE);
  let rollColor = getColorFromAngle(rotation.y, EXPECTED_ROLL_ANGLE);
  let rollString = rotation.y.toFixed(FRACTIONS_SHOWN);

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
