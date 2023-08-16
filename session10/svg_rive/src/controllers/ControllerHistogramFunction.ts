import { Car } from "../interfaces/Car";
import { LabeledPositions } from "../interfaces/LabeledPositions";
import * as _ from "lodash";

const SEGMENT_COUNT = 10;

const SegmentedCountBy = (values: number[], segments = SEGMENT_COUNT): LabeledPositions => {
  let result: LabeledPositions = {
    positions: [],
    labels: []
  };

  let maxBy = _.max(values);
  let minBy = _.min(values);

  if (maxBy !== undefined && minBy !== undefined) {
    let segment = Math.ceil((maxBy - minBy) / segments) + 1;

    let segmentedValues = _.times(segments, _.constant(0));

    let segmentedValuesDict = _.countBy(values, (value) => {
      return Math.floor((value - minBy) / segment);
    });

    let segmentedCarLabels = [];
    for (let i = 0; i < segmentedValues.length; i++) {
      if (i in segmentedValuesDict) {
        segmentedValues[i] = segmentedValuesDict[i];
      }

      // Labels
      let rangeFrom = i * segment + minBy;
      let rangeTo = rangeFrom + segment;
      result.labels.push(`${rangeFrom} - ${rangeTo}`);

      // Positions
      result.positions.push({
        x: i,
        y: segmentedValues[i]
      });
    }
  }

  return result;
}

export const CountByBrand = (carData: Car[]): LabeledPositions => {
  let result: LabeledPositions = {
    positions: [],
    labels: []
  };

  let brandTotals = _.countBy(carData, 'brand');

  result.labels = _.keys(brandTotals);
  result.positions = _.map(brandTotals, (value, key) => {
    let idx = result.labels.indexOf(key);
    return {
      x: idx,
      y: value
    };
  });

  return result;
}

export const CountByPrice = (carData: Car[]): LabeledPositions => {
  let values = _.map(carData, (car) => car.price);
  let result = SegmentedCountBy(values);
  return result
}

export const CountByMileage = (carData: Car[]): LabeledPositions => {
  let values = _.map(carData, (car) => car.mileage);
  let result = SegmentedCountBy(values);
  return result
}
