import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";

interface Props {
  default_date: string;
  onChangeDate: (date: string) => void;
}

interface State {
  date: string;
}

const styles = StyleSheet.create({
  fullView: {
    flex: 1,
    padding: 20,
  },
  titleView: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  selectedDate: {
    color: 'blueviolet',
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
    fontSize: 16,
  },
  arrowButton: {
    color: 'blueviolet',
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  dateButtonsView: {
    maxWidth: '100%',
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  dateButtonGrayed: {
    width: 40,
    height: 40,
    fontSize: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  dateButton: {
    width: 40,
    height: 40,
    fontSize: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  dateButtonSelected: {
    width: 40,
    height: 40,
    fontSize: 40,
    borderRadius: 20,
    backgroundColor: '#8a2be2a0',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#303030',
    textAlign: "center",
  },
  dateButtonTextSelected: {
    color: '#ffffff',
    textAlign: "center",
  },
  dowView: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  dowText: {
    paddingVertical: 4,
    width: 40,
    textAlign: "center",
  },
  dowTextSelected: {
    paddingVertical: 4,
    width: 40,
    textAlign: "center",
    color: 'blueviolet',
    fontWeight: "bold",
  },
});

export function ComponentCalendar(props: Props ) {
  let format = 'YYYYMMDD';

  const [state, setState] = useState({
    date: props.default_date
  } as State);

  function getFirstDate(date: string): string {
    let firstDate = moment(date, format).startOf('month');
    let firstMonday = firstDate.startOf('isoWeek');
    return firstMonday.format(format);
  }

  function getLastDate(date: string): string {
    let lastDate = moment(date, format).endOf('month');
    let firstDateNewMonth = lastDate.add(1, 'day');
    let firstSunday = firstDateNewMonth.endOf('isoWeek');
    return firstSunday.format(format);
  }

  const onPressLeft = () => {
    let date = state.date;
    let changedDate = moment(date, format).subtract(1, 'month');
    let formattedDate = changedDate.format(format);
    setState({date: formattedDate});
  }

  const onPressRight = () => {
    let date = state.date;
    let changedDate = moment(date, format).add(1, 'month');
    let formattedDate = changedDate.format(format);
    setState({date: formattedDate});
  }

  const onPressDate = (date: string) => {
    setState({date: date});
    props.onChangeDate(state.date);
  }

  let days_of_week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let dates: string[][] = [];
  let firstMonday = getFirstDate(state.date);
  let lastSunday = getLastDate(state.date);

  let currentDate = moment(firstMonday, format);
  while (currentDate.isSameOrBefore(lastSunday)) {
    dates.push([]);
    for (let i = 0; i < 7; i++) {
      dates[dates.length - 1].push(currentDate.format(format));
      currentDate.add(1, 'days');
    }
  }

  return (
    <View style={styles.fullView}>
      <View style={styles.titleView}>
        <TouchableOpacity onPress={onPressLeft}>
          <Text style={styles.arrowButton}>{'〈'}</Text>
        </TouchableOpacity>
        <Text style={styles.selectedDate}>{moment(state.date, format).format('Do MMMM, YYYY')}</Text>
        <TouchableOpacity onPress={onPressRight}>
          <Text style={styles.arrowButton}>{'〉'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dowView}>
        {days_of_week.map((day_of_week, idx) => (
          <Text
            style={day_of_week == moment(state.date, format).format('ddd') ?
              styles.dowTextSelected :
              styles.dowText}
            key={day_of_week}>{day_of_week}</Text>
        ))}
      </View>
      {dates.map((week, idx) => (
        <View style={styles.dateButtonsView}>
          {week.map((date, idx) => (
            <TouchableOpacity
              onPress={() => {
                onPressDate(date);
              }}
              style={date == state.date ?
                styles.dateButtonSelected :
                moment(date, format).isSame(moment(state.date, format), 'month') ?
                  styles.dateButton :
                  styles.dateButtonGrayed
              }
              key={date + 'touchableOpacity'}>
              <Text
                style={date == state.date ?
                  styles.dateButtonTextSelected :
                  styles.dateButtonText
                }
                key={date + 'text'}>
                  {moment(date, format).format('DD')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  )
}
