import React, { useState } from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";
import { strings } from "../utils/strings";
import DatePicker from "react-native-date-picker";
import { Habit } from "../interfaces/habit";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    backgroundColor: '#dadada',
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
    height: 40,
    color: 'black',
    marginBottom: 40,
  },
  buttonView: {
    marginBottom: 20,
  }
});

// @ts-ignore
export function ScreenHabitAdd({ navigation, route }) {
  const [title, onChangeTitle] = React.useState(strings.default_habit_title);
  const [date, setDate] = useState(new Date())
  const { habits, setHabits } = route.params;

  return (
    <View style={styles.view}>
      <View style={{width: '100%', flex: 1}}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTitle}
          value={title}
        />
        <DatePicker
          date={date}
          onDateChange={setDate}
          theme='light'
          fadeToColor='none'
          locale={strings.getLanguage()}
        />
      </View>
      <View style={{width: '100%', alignSelf: 'flex-end'}}>
        <View style={styles.buttonView}>
          <Button title={strings.button_add_habit} onPress={() => {
            let newHabit = {dateISO: date.toISOString(), title: title, id: uuidv4()} as Habit;
            setHabits([...habits, newHabit]);
            navigation.goBack();
          }}/>
        </View>
        <View style={styles.buttonView}>
          <Button title={strings.button_back} onPress={() => {
            navigation.goBack();
          }}/>
        </View>
      </View>
    </View>
  );
}
