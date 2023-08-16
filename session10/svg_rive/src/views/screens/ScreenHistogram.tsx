import { Button, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Car } from "../../interfaces/Car";
import { VictoryBar, VictoryChart, VictoryLabel } from "victory-native";
import { CountByBrand, CountByMileage, CountByPrice } from "../../controllers/ControllerHistogramFunction";
import { Position } from "../../interfaces/Position";
import { GetCars } from "../../controllers/ControllerCars";
import { VictoryChartDarkTheme } from "../themes/VictoryChartDarkTheme";

const LOAD_GIF_PATH = '../../assets/gifs/load.gif';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullView: {
    flex: 1
  },
  loadGif: {
    width: 65,
    height: 65,
  }
});

export const ScreenHistogram = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [carCounts, setCarCounts] = useState<Position[]>([]);
  const [carLabels, setCarLabels] = useState<string[]>([]);

  const loadCars = async () => {
    const tempCars = await GetCars();
    setCars(tempCars);
    setIsLoaded(true);
  }

  if (!isLoaded) loadCars();

  return (<View style={styles.view}>
    { isLoaded ?
      <ScrollView>
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
              theme={VictoryChartDarkTheme}
            >
              <VictoryBar
                horizontal
                alignment='start'
                style={{
                  data: { fill: '#FF0000' },
                }}
                data={carCounts}
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
                let result = CountByBrand(cars);
                setCarCounts(result.positions);
                setCarLabels(result.labels);
              }}
            />
            <Button
              title='Count By Price'
              onPress={() => {
                let result = CountByPrice(cars);
                setCarCounts(result.positions);
                setCarLabels(result.labels);
              }}
            />
            <Button
              title='Count By Mileage'
              onPress={() => {
                let result = CountByMileage(cars);
                setCarCounts(result.positions);
                setCarLabels(result.labels);
              }}
            />
          </View>
        </View>
      </ScrollView>
      : <View>
        <Image
          source={require(LOAD_GIF_PATH)}
          style={styles.loadGif}
        />
      </View>
    }
  </View>);
};
