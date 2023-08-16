import { CarRaw } from "../interfaces/CarRaw";
import { readString } from "react-native-csv";
import { Car } from "../interfaces/Car";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CAR_DATA_URL = 'http://share.yellowrobot.xyz/quick/2020-4-22-C9EF4A79-EA4E-488D-9277-0B7B52B6C74E.csv';
const CAR_CACHE_KEY = 'CAR_CACHE';

const csvConfig = {
  header: true,
  skipEmptyLines: true,
}

export const GetCars = async (): Promise<Car[]> => {
  let result: Car[] = [];

  try {
    const cachedCarsJson = await AsyncStorage.getItem(CAR_CACHE_KEY);

    if (cachedCarsJson === null) {
      // DOWNLOAD CARS
      let response = await fetch(CAR_DATA_URL);
      let responseString = await response.text();
      //@ts-ignore
      let carDataResults: CarRaw[] = readString(responseString, csvConfig).data;

      // CONVERT STRINGS INTO NUMBERS FOR LODASH OPERATIONS
      for (let carDataResult of carDataResults) {
        result.push({
          car_id: parseInt(carDataResult.car_id),
          price: parseFloat(carDataResult.price),
          brand: carDataResult.brand,
          model: carDataResult.model,
          year: parseInt(carDataResult.year),
          status: carDataResult.status,
          mileage: parseFloat(carDataResult.mileage),
          color: carDataResult.color,
          vin: carDataResult.vin,
          lot: carDataResult.lot,
          state: carDataResult.state,
          country: carDataResult.country,
          condition: carDataResult.condition
        });
      }

      // CACHE CARS
      const resultCache = JSON.stringify(result);
      await AsyncStorage.setItem(CAR_CACHE_KEY, resultCache);
    } else {
      result = JSON.parse(cachedCarsJson);
    }
  } catch (err) {
    console.error(err);
  }

  return result;
}
