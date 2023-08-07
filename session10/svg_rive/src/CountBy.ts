import { CarData } from "./interfaces/CarData";
import { LabeledData } from "./interfaces/LabeledData";
import * as _ from "lodash";

const SEGMENT_COUNT = 10;

const defaultLabeledData: LabeledData = {
  data: [],
  labels: []
};

const SegmentedCountBy = (carData: CarData[], property: keyof CarData): LabeledData => {
  let result: LabeledData = defaultLabeledData;

  try {
    let maxBy = _.maxBy(carData, property)[property];
    let minBy = _.minBy(carData, property)[property];
    let segment = Math.ceil((maxBy - minBy) / SEGMENT_COUNT);

    // Segment the car data by property
    let segmentedCarData = _.times(SEGMENT_COUNT, _.constant(0));

    let segmentedCarDataDict = _.countBy(carData, (elem) => {
      return Math.floor((elem[property] - minBy) / segment);
    });

    for (let i = 0; i < segmentedCarData.length; i++) {
      if (i in segmentedCarDataDict) {
        segmentedCarData[i] = segmentedCarDataDict[i];
      }
    }

    // Make the labels for car property segments
    let segmentedCarLabels = [];
    for (let i = 0; i < segmentedCarData.length; i++) {
      let from = i * segment + minBy;
      let to = from + segment;
      segmentedCarLabels.push(`${from} - ${to}`);
    }

    result.labels = segmentedCarLabels;
    result.data = _.map(segmentedCarData, (value, key) => {
      return {
        x: key,
        y: value
      };
    });
  } catch (err) {
    console.error(err);
  }

  return result;
}

export const CountByBrand = (carData: CarData[]): LabeledData => {
  let result: LabeledData = defaultLabeledData;

  let brandTotals = _.countBy(carData, 'brand');

  result.labels = _.keys(brandTotals);
  result.data = _.map(brandTotals, (value, key) => {
    let idx = result.labels.indexOf(key);
    return {
      x: idx,
      y: value
    };
  });

  return result;
}

export const CountByPrice = (carData: CarData[]): LabeledData => {
  let result = SegmentedCountBy(carData, 'price');
  return result
}

export const CountByMileage = (carData: CarData[]): LabeledData => {
  let result = SegmentedCountBy(carData, 'mileage');
  return result
}
