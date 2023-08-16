import { Button, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { HabitsHistory } from "../../interfaces/HabitsHistory";
import { VictoryChart, VictoryLine } from "victory-native";
import * as _ from "lodash";
import { VictoryChartDarkTheme } from "../themes/VictoryChartDarkTheme";

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asset: {
    width: 300,
    height: 300,
  }
});

const defaultHabitsHistory: HabitsHistory = {
  reading: [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 1}
  ],
  running: [
    {x: 0, y: 0},
    {x: 1, y: 2},
    {x: 2, y: 4}
  ]
};

export const ScreenGraph = () => {
  const [habitsHistory, setHabitsHistory] = useState(defaultHabitsHistory);

  return (<View style={styles.view}>
    <VictoryChart
      width={300}
      height={200}
      style={{
        background: { fill: "#FF000010" },
      }}
      theme={VictoryChartDarkTheme}
    >
      {_.keys(habitsHistory).map((keyHabit: string) =>
        <VictoryLine
          key={keyHabit + habitsHistory[keyHabit].length.toString()}
          interpolation='natural'
          style={{
            data: {
              stroke: keyHabit == 'reading' ? '#FF0000' : '#00A0FF',
              strokeWidth: 2,
            }
          }}
          data={habitsHistory[keyHabit]}
          labels={[]}
        />
      )}

      {/* CRASHES WHEN USING VICTORY LEGEND */}

      {/*<VictoryLegend*/}
      {/*  x={0}*/}
      {/*  y={0}*/}
      {/*  orientation={"horizontal"}*/}
      {/*  data={[*/}
      {/*    {*/}
      {/*      name: "reading",*/}
      {/*      symbol: { fill: "#FF0000" }*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: "running",*/}
      {/*      symbol: { fill: "#0000FF" }*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*/>*/}

    </VictoryChart>
    <Button
      title='Update'
      onPress={() => {
        if (habitsHistory.reading && habitsHistory.reading.length > 0) {
          habitsHistory.reading.push({
            //@ts-ignore
            x: _.last(habitsHistory.reading).x + 1,
            y: _.random(0, 4)
          });
          setHabitsHistory({...habitsHistory});
        }
      }}
    />
  </View>);
};
