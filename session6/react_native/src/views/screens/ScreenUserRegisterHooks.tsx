import React, { useEffect, useState } from "react";
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import DeviceInfo from "react-native-device-info";

interface Props {
  default_email: string;
  onRegisterDone: () => void;
}

interface State {
  username: string;
  email: string;
  password: string;
  error_message: string;
}

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    padding: 20
  },
  textInput: {
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 18
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10
  }
});

export function ScreenUserRegisterHooks(props: Props ) {
  const [state, setState] = useState({
    username: '',
    email: props.default_email,
    password: '',
    error_message: ''
  } as State);

  const load = async () => {
    let defaultUsername = await DeviceInfo.getDeviceName();
    setState({...state, username: defaultUsername});
  };

  useEffect(() => {
    load();
    return () => {
      // Optional unmount
    }
  }, [
    // Vars / hooks that trigger function
    // If null, trigger once
  ]);

  const registerUser = () => {
    let username = state.username.trim();
    let email = state.email.trim();
    let password = state.password.trim();

    let usernameValid = (username.length > 0);
    let emailValid = (email.length > 0);
    let passwordValid = (password.length > 0);

    let error_message = '';
    if(usernameValid &&
      emailValid &&
      passwordValid
    ) {
      alert(state.username);
      props.onRegisterDone();
    } else {
      if (!usernameValid) {
        error_message += 'Empty username! ';
      }
      if (!emailValid) {
        error_message += 'Empty email! ';
      }
      if (!passwordValid) {
        error_message += 'Empty password! ';
      }
    }

    setState({
      ...state,
      error_message: error_message
    });
  }

  let error_message = state.error_message;
  return (
    <View style={styles.fullView}>
      <Text style={styles.errorMessage}>{error_message}</Text>
      <TextInput placeholder={'User'}
                 value={state.username}
                 onChangeText={text => setState({...state, username: text})}
                 style={styles.textInput}></TextInput>
      <TextInput placeholder={'Email'}
                 value={state.email}
                 textContentType={'emailAddress'}
                 keyboardType={"email-address"}
                 onChangeText={text => setState({...state, email: text})}
                 style={styles.textInput}></TextInput>
      <TextInput placeholder={'Password'}
                 value={state.password}
                 secureTextEntry={true}
                 textContentType={'password'}
                 onChangeText={text => setState({...state, password: text})}
                 style={styles.textInput}></TextInput>
      <Button title={'Register'} onPress={registerUser}></Button>
    </View>
  )
}
