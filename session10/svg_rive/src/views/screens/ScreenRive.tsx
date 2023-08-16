import React, { useEffect, useState } from "react";
import Rive, { RiveRef } from "rive-react-native";
import { StateInput } from "../../interfaces/StateInput";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { riveAvatars } from "../../RiveAvatars";
import { RiveAvatar } from "../../interfaces/RiveAvatar";
import _ from "lodash";

const RIVE_RESOURCE_NAME = 'vehicles';
const CYCLE_CLEAR_LAST = true;

const styles = StyleSheet.create({
  horizontalView: {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  verticalView: {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    marginHorizontal: 32,
  },
  verticalViewChild: {
    marginBottom: 16,
  },
  verticalViewText: {
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  rive: {
    width: '100%',
    aspectRatio: 1,
  }
});

let animations: string[] = [];
let actions: StateInput[] = [];

export const ScreenRive = () => {
  const [riveAvatar, setRiveAvatar] = useState<RiveAvatar>(riveAvatars[0]);

  animations = _.clone(riveAvatar.animations);
  actions = riveAvatar.actions;

  const riveRef = React.useRef<RiveRef>(null);

  const [riveCycleAnimations, setRiveCycleAnimations] = useState<string[]>(_.clone(animations));
  const [cyclingAnimations, setCyclingAnimations] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('None');

  const cycleAnimation = () => {
    if (CYCLE_CLEAR_LAST) {
      riveRef.current?.play();
    }
    riveRef.current?.stop();

    if (riveCycleAnimations.length > 0) {
      let nextRiveCycleAnimations = riveCycleAnimations;
      let nextAnimation = nextRiveCycleAnimations.shift();
      //@ts-ignore
      nextRiveCycleAnimations.push(nextAnimation);

      //@ts-ignore
      setCurrentAnimation(nextAnimation);
      setRiveCycleAnimations(nextRiveCycleAnimations);

      riveRef.current?.play(nextAnimation);
    }
  }

  const handlePlayDefault = () => {
    setCyclingAnimations(false);
    riveRef.current?.play();
  }
  const handlePlayAnimation = (animation: string) => {
    setCyclingAnimations(false);
    riveRef.current?.play(animation);
  }
  const handleStop = () => {
    setCyclingAnimations(false);
    riveRef.current?.stop();
  }
  const handlePlayCycle = () => {
    setCyclingAnimations(true);
    if (riveCycleAnimations.length > 0) {
      cycleAnimation();
    }
  }
  const handleStateAction = (stateMachineName: string, inputName: string) => {
    riveRef.current?.fireState(stateMachineName, inputName);
  }
  const handleToggleStateAction = (stateMachineName: string, inputName: string, value: boolean) => {
    riveRef.current?.setInputState(stateMachineName, inputName, value);
  }

  const handleNext = () => {
    let riveObjectIdx = riveAvatars.indexOf(riveAvatar);
    let nextRiveAvatarIdx = riveObjectIdx + 1;

    if (nextRiveAvatarIdx > riveAvatars.length - 1) {
      nextRiveAvatarIdx = 0;
    }

    let nextRiveAvatar = riveAvatars[nextRiveAvatarIdx];
    setRiveAvatar(nextRiveAvatar);

    animations = _.clone(nextRiveAvatar.animations);
    setRiveCycleAnimations(animations);
  }

  const handleLoopEnd = () => {
    if (cyclingAnimations) {
      cycleAnimation();
    }
  }

  return (<View>
    <ScrollView>
      <Rive
        resourceName={RIVE_RESOURCE_NAME}
        ref={riveRef}
        artboardName={riveAvatar.name}
        autoplay={false}
        style={styles.rive}
        onLoopEnd={handleLoopEnd}
      />
      <View
        style={styles.horizontalView}
      >
        <Button
          onPress={handlePlayDefault}
          title="Play Default"
        />
        <Button
          onPress={handlePlayCycle}
          title="Cycle"
        />
        <Button
          onPress={handleStop}
          title="Stop"
        />
      </View>
      {cyclingAnimations &&
        <Text style={
          {...styles.verticalViewText, marginTop: 16}
        }>
          {`Playing: ${currentAnimation}`}
        </Text>
      }
      <View style={styles.verticalView}>
        <Text style={styles.verticalViewText}>Animations:</Text>
        {animations.map((animation: string) =>
          <View
            key={`view-${animation}`}
            style={styles.verticalViewChild}
          >
            <Button
              key={`button-${animation}`}
              onPress={() => {handlePlayAnimation(animation)}}
              title={`Play ${animation}`}
            />
          </View>
        )}
      </View>
      <View style={styles.verticalView}>
        <Text style={styles.verticalViewText}>Actions:</Text>
        {actions.map((action: StateInput) =>
          <View
            key={`view-${action.stateMachineName}-${action.inputName}`}
            style={styles.verticalViewChild}
          >
            {action.isToggle ? <View style={styles.verticalView}>
              <Text
                style={{...styles.verticalViewText, marginBottom: 0}}
              >
                {`${action.stateMachineName} - ${action.inputName}`}
              </Text>
              <View style={styles.horizontalView}>
                <Button
                  key={`button-false-${action.stateMachineName}-${action.inputName}`}
                  onPress={() => {
                    handleToggleStateAction(action.stateMachineName, action.inputName, false)
                  }}
                  title={`Set False`}
                />
                <Button
                  key={`button-true-${action.stateMachineName}-${action.inputName}`}
                  onPress={() => {
                    handleToggleStateAction(action.stateMachineName, action.inputName, true)
                  }}
                  title={`Set True`}
                />
              </View>
            </View> : <Button
              key={`button-${action.stateMachineName}-${action.inputName}`}
              onPress={() => {
                handleStateAction(action.stateMachineName, action.inputName)
              }}
              title={`${action.stateMachineName} - ${action.inputName}`}
            />}
          </View>
        )}
      </View>
      <View style={{
        marginTop: 16,
        marginBottom: 32,
        marginHorizontal: 32,
      }}>
        <Button
          onPress={handleNext}
          title='Next Object'
        />
      </View>
    </ScrollView>
  </View>);
}
