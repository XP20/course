import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";

interface Props {
  default_date: moment.Moment;
  onChangeDate: (date: moment.Moment) => void;
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

export function ComponentCalendar(props: Props) {
  let keyFormat = 'YYYYMMDD';
  let days_of_week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [currentDate, setCurrentDate] = useState(props.default_date);

  let default_dates: moment.Moment[][] = [];
  const [dates, setDates] = useState(default_dates);

  let currentDateTitle = '';
  let currentDOW = 'Mon';

  const getFirstDate = (date: moment.Moment): moment.Moment => {
    let firstDate = date.startOf('month');
    let firstMonday = firstDate.startOf('isoWeek');
    return firstMonday;
  }

  const getLastDate = (date: moment.Moment): moment.Moment => {
    let lastDate = date.endOf('month');
    let firstDateNewMonth = lastDate.add(1, 'day');
    let firstSunday = firstDateNewMonth.endOf('isoWeek');
    return firstSunday;
  }

  useEffect(() => {
    let tempDates: moment.Moment[][] = [];
    let firstMonday = getFirstDate(currentDate);
    let lastSunday = getLastDate(currentDate);

    let currentLoopDate = firstMonday;
    while (currentLoopDate.isSameOrBefore(lastSunday)) {
      tempDates.push([]);
      for (let i = 0; i < 7; i++) {
        tempDates[tempDates.length - 1].push(currentLoopDate);
        currentLoopDate.add(1, 'days');
      }
    }

    setDates(tempDates);

    currentDateTitle = currentDate.format('Do MMMM, YYYY');
    currentDOW = currentDate.format('ddd');
  }, [currentDate]);

  const isSameMonth = (date1: moment.Moment, date2: moment.Moment) => {
    let result = false;
    try {
      result = date1.isSame(currentDate, 'month');
    } catch(exc) {
      console.log(exc);
    }

    return result;
  }

  const onPressLeft = () => {
    let changedDate = currentDate.subtract(1, 'month');
    setCurrentDate(changedDate);
  }

  const onPressRight = () => {
    let changedDate = currentDate.add(1, 'month');
    setCurrentDate(changedDate);
  }

  const onPressDate = (date: moment.Moment) => {
    setCurrentDate(date);
    props.onChangeDate(currentDate);
  }

  return (
    <View style={styles.fullView}>
      <View style={styles.titleView}>
        <TouchableOpacity onPress={onPressLeft}>
          <Text style={styles.arrowButton}>'〈'</Text>
        </TouchableOpacity>
        <Text style={styles.selectedDate}>{currentDateTitle}</Text>
        <TouchableOpacity onPress={onPressRight}>
          <Text style={styles.arrowButton}>'〉'</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dowView}>
        {days_of_week.map((day_of_week, idx) => (
          <Text
            style={day_of_week == currentDOW ?
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
              style={date == currentDate ?
                styles.dateButtonSelected :
                isSameMonth(date, currentDate) ?
                  styles.dateButton :
                  styles.dateButtonGrayed
              }
              key={date.format(keyFormat) + 'touchableOpacity'}>
              <Text
                style={date == currentDate ?
                  styles.dateButtonTextSelected :
                  styles.dateButtonText
                }
                key={date.format(keyFormat) + 'text'}>
                  {date.format('DD')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  )
}
