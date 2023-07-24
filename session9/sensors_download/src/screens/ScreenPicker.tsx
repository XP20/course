import RNFS from "react-native-fs";
import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import ImageCropPicker, { Options } from 'react-native-image-crop-picker';

const PATH_PROFILE_IMAGE = `${RNFS.DocumentDirectoryPath}/profile.jpg`;

const styles = StyleSheet.create ({
  view: {
    padding: 30
  },
  image: {
    width: 256,
    height: 256
  }
});

const pickerOptions: Options = {
  width: 256,
  height: 256,
  cropping: true,
  mediaType: 'photo',
  forceJpg: true
};

export //@ts-ignore
const ScreenPicker = ({navigation}) => {
  const [pathProfilePic, setPathProfilePic] = useState('');
  let currentTime = (new Date()).getTime();
  const [isUpdated, setIsUpdated] = useState(currentTime);

  const load = async () => {
    if (await RNFS.exists(PATH_PROFILE_IMAGE)) {
      setPathProfilePic(`file://${PATH_PROFILE_IMAGE}`);
    }
  };

  useEffect(() => {
    load();
  }, [isUpdated])

  const onChooseImage = async () => {
    const image = await ImageCropPicker.openCamera(pickerOptions);

    let tempImagePath = image.path;
    await RNFS.moveFile(tempImagePath, PATH_PROFILE_IMAGE);
    setIsUpdated((new Date()).getTime());
  }

  const onPressAlignRotation = () => {
    navigation.navigate('Rotation');
  }

  return (<View style={styles.view}>
    {pathProfilePic && <Image style={styles.image} source={{uri: `${pathProfilePic}?time=${isUpdated.toString()}`, cache: 'reload'}} />}
    <Button title='Choose image' onPress={onChooseImage} />
    <Button title='Align Rotation' onPress={onPressAlignRotation} />
  </View>);
}
