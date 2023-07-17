import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { Button, Icon, Input, ListItem } from "@rneui/themed";
import { Habit } from "../interfaces/habit";
import _ from 'lodash';
import axios from 'axios';
import md5 from 'crypto-js/md5';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DbUser } from "../interfaces/dbUser";
import { User } from "../interfaces/user";
import { strings } from "../utils/strings";

const AIRTABLE_API_TOKEN = 'YOUR_API_TOKEN';
const AIRTABLE_USERS_URL = 'https://api.airtable.com/v0/app4LGrIdBiZAZLsd/users';
const API_URL = 'YOUR_API_URL'

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%'
  },
  button: {
    margin: 20,
  }
});

function dateFormat(date: Date) {
  let date_String = date.getFullYear() + "/" +
    (date.getMonth() + 1) + "/" +
    + date.getDate() + " " +
    + date.getHours() + ":" +
    + date.getMinutes();
  return date_String;
}

// @ts-ignore
export function ScreenHome({ navigation, route }) {
  const { default_habits } = route.params;

  const [habits, setHabits] = useState(default_habits);
  const [password, setPassword] = useState('');
  let default_user: User = {
    user_id: 0,
    username: '',
    photo_url: '',
    is_logged: false,
  };
  const [user, setUser] = useState(default_user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      async function load() {
        let userJSON = await AsyncStorage.getItem('user');
        if (userJSON != null) {
          let userRestored = JSON.parse(userJSON);
          setUser(userRestored);
        }
      }
      load();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const onLogin = async () => {
    if(!isLoading) {
      setIsLoading(true);
      Keyboard.dismiss();
      try {
        // let response = await axios.get(
        //   AIRTABLE_USERS_URL,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${AIRTABLE_API_TOKEN}`
        //     }
        //   }
        // );
        //
        // //@ts-ignore
        // let users: DbUser[] = response.data.records.map(it => it.fields);
        //
        // // Verify login information
        // for (let userEach of users) {
        //   if (userEach.username == user.username) {
        //     let hash = md5(password).toString();
        //     if (userEach.password == hash) {
        //       console.log('Successful login');
        //       let photo_url = userEach.photo[0].url;
        //       let user_new = {
        //         user_id: userEach.user_id,
        //         username: userEach.username,
        //         photo_url: photo_url,
        //         is_logged: true,
        //       };
        //       setUser(user_new);
        //
        //       let json_user_new = JSON.stringify(user_new);
        //       await AsyncStorage.setItem('user', json_user_new);
        //       break;
        //     }
        //   }
        // }

        let response = await axios.post(
          `${API_URL}/user/login`,
          {
            username: user.username,
            password: password
          },
          {
            headers: {
              'content-type': 'application/json'
            }
          }
        );

        let response_data = response.data;
        if (response_data) {
          let user_new: User = {
            ...response_data,
            is_logged: true
          };
          setUser(user_new);

          let json_user_new = JSON.stringify(user_new);
          await AsyncStorage.setItem('user', json_user_new);
        }
      }
      catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  };

  const onLogout = () => {
    try {
      setUser({
        ...user,
        is_logged: false,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.view}>
      {user.is_logged ?
        <View style={styles.view}>
          {habits.map((habit: Habit, index: number) => (
            <ListItem.Swipeable
              key={`ListItemSwipeable${index}`}
              rightContent={(reset) => (
                <Button
                  title={strings.button_delete_habit}
                  key={'Button' + index}
                  onPress={() => {
                    let newHabits = _.clone(habits);
                    _.remove(newHabits,
                      (removeHabit: Habit) =>
                        removeHabit.id == habit.id);
                    setHabits(newHabits);
                  }}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}>
              <Icon name="date-range" />
              <ListItem.Content>
                <ListItem.Title>{habit.title}</ListItem.Title>
                <ListItem.Subtitle>{dateFormat(new Date(habit.dateISO))}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          ))}
          <Button
            buttonStyle={{margin: 20}}
            onPress={onLogout}>
              Logout
          </Button>
        </View> :
        <View style={styles.view}>
          <Text>{strings.text_user}</Text>
          <Input
            style={{marginHorizontal: 20}}
            placeholder={strings.input_username_placeholder}
            value={user.username}
            onChangeText={text => setUser({...user, username: text})} />
          <Input
            style={{marginHorizontal: 20}}
            placeholder={strings.input_password_placeholder}
            value={password}
            textContentType='password'
            secureTextEntry={true}
            onChangeText={text => setPassword(text)} />
          <Button buttonStyle={{margin: 20}} onPress={onLogin}>{isLoading && <ActivityIndicator size='small' color='white' />}
            {strings.button_login}
          </Button>
        </View>
      }
      <View style={{margin: 20}}>
        <Button
          title={strings.button_add_habit}
          style={styles.button}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('ScreenHabitAdd', {
              habits: habits,
              setHabits: setHabits
            });
          }}>
          <Icon
            name='add-box'
            color='white' />
          {'  ' + strings.button_add_habit}
        </Button>
      </View>
    </View>
  );
}
