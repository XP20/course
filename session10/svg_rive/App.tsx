import React, { useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import SvgAvailability from "./src/assets/svg/SvgAvailability";
import { VictoryBar, VictoryChart, VictoryLabel, VictoryLine } from "victory-native";
import * as _ from "lodash";
import { HabitsHistory } from "./src/interfaces/HabitsHistory";
import { readString } from "react-native-csv";
import { CarData } from "./src/interfaces/CarData";
import { CarDataRaw } from "./src/interfaces/CarDataRaw";
import { CountByBrand, CountByMileage, CountByPrice } from "./src/CountBy";
import { Position } from "./src/interfaces/Position";
import Rive, { RiveRef } from "rive-react-native";
import { StateAction } from "./src/interfaces/StateAction";
import { RiveObject } from "./src/interfaces/RiveObject";

const CAR_DATA_URL = 'http://share.yellowrobot.xyz/quick/2020-4-22-C9EF4A79-EA4E-488D-9277-0B7B52B6C74E.csv';
const RIVE_RESOURCE_NAME = 'vehicles';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullView: {
    flex: 1
  },
  asset: {
    width: 300,
    height: 300,
  },
  loadGif: {
    width: 65,
    height: 65,
  },
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
  }
});

const chartTheme = {
  axis: {
    style: {
      tickLabels: {
        fill: '#FFFFFF',
      },
      grid: {
        stroke: '#FFFFFF',
        strokeOpacity: 0,
      }
    },
  }
};

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

const defaultCarData: Position[] = [];
const defaultCarLabels: string[] = [];
const defaultCarDataVerbose: CarData[] = [];

let carDataFunction = CountByBrand;

const csvConfig = {
  header: true,
  skipEmptyLines: true,
}

const riveObjects: RiveObject[] = [
  {
    name: 'Truck',
    animations: [
      'curves',
      'idle'
    ],
    actions: [
      {
        stateMachineName: 'bumpy',
        inputName: 'bump',
        isToggle: false
      }
    ],
    style: {
      width: 360,
      height: 360,
      marginTop: -80,
      marginBottom: -80
    }
  },
  {
    name: 'Jeep',
    animations: [
      'idle',
      'rainy',
      'bouncing',
      'windshield_wipers',
      'broken'
    ],
    actions: [
      {
        stateMachineName: 'weather',
        inputName: 'Raining',
        isToggle: true
      }
    ],
    style: {
      width: 400,
      height: 400,
      marginTop: -40,
      marginBottom: 0
    }
  }
];

const AppSvg = () => {
  return (<View style={styles.view}>
    <Image
      source={require('./src/assets/images/Availability.png')}
      style={styles.asset}
    />
    <SvgAvailability width={300} height={300} />
  </View>);
}

const AppGraph = () => {
  const [habitsHistory, setHabitsHistory] = useState(defaultHabitsHistory);

  return (<View style={styles.view}>
    <VictoryChart
      width={300}
      height={200}
      style={{
        background: { fill: "#FF000010" },
      }}
      theme={chartTheme}
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
        habitsHistory.reading.push({
          x: _.last(habitsHistory.reading).x + 1,
          y: _.random(0, 4)
        });
        setHabitsHistory({...habitsHistory});
      }}
    />
  </View>);
}

const AppCSV = () => {
  const [isDataDownloaded, setIsDataDownloaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [carDataVerbose, setCarDataVerbose] = useState(defaultCarDataVerbose);

  const [carData, setCarData] = useState(defaultCarData);
  const [carLabels, setCarLabels] = useState(defaultCarLabels);

  const loadCarData = async () => {
    try {
      let response = await fetch(CAR_DATA_URL);
      let responseString = await response.text();
      let carDataResults: CarDataRaw[] = readString(responseString, csvConfig).data;

      let tempCarDataVerbose: CarData[] = [];

      // Convert string into number for lodash operations
      for (let carDataResult of carDataResults) {
        tempCarDataVerbose.push({
          idx: parseInt(carDataResult.idx),
          price: parseFloat(carDataResult.price),
          brand: carDataResult.brand,
          model: carDataResult.model,
          year: parseInt(carDataResult.year),
          title_status: carDataResult.title_status,
          mileage: parseFloat(carDataResult.mileage),
          color: carDataResult.color,
          vin: carDataResult.vin,
          lot: carDataResult.lot,
          state: carDataResult.state,
          country: carDataResult.country,
          condition: carDataResult.condition
        });
      }

      setCarDataVerbose(tempCarDataVerbose);

      setIsLoaded(true);
    } catch (err) {
      console.error(err);
    }
  }

  const updateCarData = async () => {
    if (isLoaded) {
      setIsLoaded(false);

      let result = carDataFunction(carDataVerbose);
      setCarData(result.data);
      setCarLabels(result.labels);

      setIsLoaded(true);
    }
  }

  if (!isDataDownloaded) {
    setIsDataDownloaded(true);
    loadCarData();
  }

  return (<View style={styles.view}>
    { isLoaded ?
      <View>
        <View style={styles.fullView}>
          <VictoryChart
            width={360}
            height={600}
            domainPadding={{
              x: 10,
              y: 60
            }}
            style={{
              background: { fill: "#FF000010" },
            }}
            theme={chartTheme}
          >
            <VictoryBar
              horizontal
              alignment='start'
              style={{
                data: {
                  fill: '#FF0000'
                }
              }}
              data={carData}
              labels={carLabels}
              labelComponent={
                <VictoryLabel
                  dx={5}
                  dy={-5}
                  style={{
                    fill: '#FFFFFF'
                  }}
                />
              }
            />
          </VictoryChart>
        </View>
        <View style={{
          marginHorizontal: 40,
          marginBottom: 24,
          height: 120,
          justifyContent: 'space-between',
        }}>
          <Button
            title='Count By Brand'
            onPress={() => {
              carDataFunction = CountByBrand;
              updateCarData();
            }}
          />
          <Button
            title='Count By Price'
            onPress={() => {
              carDataFunction = CountByPrice;
              updateCarData();
            }}
          />
          <Button
            title='Count By Mileage'
            onPress={() => {
              carDataFunction = CountByMileage;
              updateCarData();
            }}
          />
        </View>
      </View>
      : <View>
        <Image
          source={require('./src/assets/gifs/load.gif')}
          style={styles.loadGif}
        />
      </View>
    }
  </View>);
}

const App = () => {
  const [riveObject, setRiveObject] = useState(riveObjects[0]);

  const riveRef = React.useRef<RiveRef>(null);

  let animations = riveObject.animations;
  let actions: StateAction[] = riveObject.actions;

  const handlePlayDefault = () => {
    riveRef.current?.play();
  }
  const handlePlayAnimation = (animation: string) => {
    riveRef.current?.play(animation);
  }
  const handleStop = () => {
    riveRef.current?.stop();
  }
  const handleStateAction = (stateMachineName: string, inputName: string) => {
    riveRef.current?.fireState(stateMachineName, inputName);
  }
  const handleToggleStateAction = (stateMachineName: string, inputName: string, value: boolean) => {
    riveRef.current?.setInputState(stateMachineName, inputName, value);
  }

  const handleNext = () => {
    let riveObjectIdx = riveObjects.indexOf(riveObject);
    let nextRiveObjectIdx = riveObjectIdx + 1;

    if (nextRiveObjectIdx > riveObjects.length - 1) {
      nextRiveObjectIdx = 0;
    }

    let nextRiveObject = riveObjects[nextRiveObjectIdx];
    setRiveObject(nextRiveObject);
  }

  return (<View>
    <ScrollView>
      <Rive
        resourceName={RIVE_RESOURCE_NAME}
        ref={riveRef}
        artboardName={riveObject.name}
        autoplay={false}
        style={riveObject.style}
      />
      <View
        style={styles.horizontalView}
      >
        <Button
          onPress={handlePlayDefault}
          title="Play Default"
        />
        <Button
          onPress={handleStop}
          title="Stop"
        />
      </View>
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
        {actions.map((action: StateAction) =>
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

export default App;
