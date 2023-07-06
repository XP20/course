import React from "react";
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import DeviceInfo from "react-native-device-info";

interface Props {

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

export class ScreenUserRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      error_message: ''
    }
  }

  componentDidMount = async () => {
    let defaultUsername = await DeviceInfo.getDeviceName();
    this.setState({username: defaultUsername});
  }

  registerUser = () => {
    let username = this.state.username.trim();
    let email = this.state.email.trim();
    let password = this.state.password.trim();

    let usernameValid = (username.length > 0);
    let emailValid = (email.length > 0);
    let passwordValid = (password.length > 0);

    let error_message = '';
    if(usernameValid &&
       emailValid &&
       passwordValid
    ) {
      alert(this.state.username);
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

    this.setState({
      error_message: error_message
    });
  }

  render = () => {
    let error_message = this.state.error_message;
    return (
      <View style={styles.fullView}>
        <Text style={styles.errorMessage}>{error_message}</Text>
        <TextInput placeholder='User'
                   value={this.state.username}
                   onChangeText={text => this.setState({username: text})}
                   style={styles.textInput}></TextInput>
        <TextInput placeholder='Email'
                   value={this.state.email}
                   textContentType='emailAddress'
                   keyboardType='email-address'
                   onChangeText={text => this.setState({email: text})}
                   style={styles.textInput}></TextInput>
        <TextInput placeholder='Password'
                   value={this.state.password}
                   secureTextEntry={true}
                   textContentType='password'
                   onChangeText={text => this.setState({password: text})}
                   style={styles.textInput}></TextInput>
        <Button title='Register' onPress={this.registerUser}></Button>
      </View>
    )
  }
}
