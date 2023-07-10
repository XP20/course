import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon, ListItem } from "@rneui/themed";
import { ContextStrings, strings } from "../utils/strings";
import { Habit } from "../interfaces/habit";
import _ from 'lodash';

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

  const [habits, setHabits] = useState(default_habits)

  return (
    <View style={styles.view}>
      <View style={styles.view}>
        {habits.map((habit: Habit, index: number) => (
          <ListItem.Swipeable
            key={'ListItemSwipeable' + index}
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
      </View>
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
