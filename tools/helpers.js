// helper.js

// Function to extract "v" values from the data array
function extractValues(data) {
  // Check if the input data is an array
  if (!Array.isArray(data)) {
    throw new Error("Input data must be an array");
  }

  // Use the map function to create a new array with only the "v" values
  const valuesArray = data.map((item) => item.v);

  return valuesArray;
}

// Function to determine the trend of an array of numbers
function basicTrend(numbers, percentageThreshold) {
  if (!Array.isArray(numbers) || numbers.length < 2) {
    throw new Error("Input must be an array with at least two numbers");
  }

  if (typeof percentageThreshold !== "number" || percentageThreshold <= 0) {
    throw new Error("Percentage threshold must be a positive number");
  }

  const lastValue = numbers[numbers.length - 1];
  const firstValue = numbers[0];

  const percentageDifference = ((lastValue - firstValue) / firstValue) * 100;

  if (percentageDifference > percentageThreshold) {
    return "trending up";
  } else if (percentageDifference < -percentageThreshold) {
    return "trending down";
  } else {
    return "a flat trend";
  }
}

function arrayDeltaComparator(dataArr1, dataArr2) {
  // Calculate the average of each array
  if (!Array.isArray(dataArr1) || !Array.isArray(dataArr2)) {
    throw new Error("Both arguments must be arrays");
  }
  const avg1 = calculateArrAverage(dataArr1);
  const avg2 = calculateArrAverage(dataArr2);
  const delta = avg1 - avg2;

  // Compare the averages
  if (avg1 > avg2) {
    return { info: "nett increase between", delta: delta };
  } else if (avg1 < avg2) {
    return { info: "nett decrease between", delta: delta };
  } else {
    return { info: "no nett difference between", delta: delta };
  }
}

function calculateArrAverage(arr) {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, num) => acc + num, 0);
  return sum / arr.length;
}

function returnStatus(value, threshold) {
  // e.g. pump flow rate value, and threshold to be classed as running i.e. 30, 5 - will return yes.
 // console.log("args", value, threshold);
  if (value > threshold) {
    return "yes";
  } else {
    return "no";
  }
}

function addArrays(arr1, arr2) {
  // Check if the inputs are arrays
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error("Both arguments must be arrays");
  }

  // Find the minimum length of the two arrays
  const minLength = Math.min(arr1.length, arr2.length);

  // Trim the longer array to match the length of the shorter array
  const trimmedArr1 = arr1.slice(0, minLength);
  const trimmedArr2 = arr2.slice(0, minLength);

  // Create a new array to store the sum of corresponding elements
  const newArr = [];

  // Iterate through the arrays and add corresponding elements
  for (let i = 0; i < minLength; i++) {
    newArr.push(trimmedArr1[i] + trimmedArr2[i]);
  }

  return newArr;
}


function analyzeTrend(array, threshold) {
  if (!Array.isArray(array) || array.length < 2) {
    return { error: "Input should be an array with at least two elements." };
  }

  const firstHalf = array.slice(0, Math.floor(array.length / 2));
  const secondHalf = array.slice(Math.floor(array.length / 2));

  const meanFirstHalf = firstHalf.reduce((sum, value) => sum + value, 0) / firstHalf.length;
  const meanSecondHalf = secondHalf.reduce((sum, value) => sum + value, 0) / secondHalf.length;

  const vector = meanSecondHalf - meanFirstHalf;
  const trendInfo = vector < threshold ? "The trend is flat." : "The trend is increasing/decreasing.";

  return { vector: vector, info: trendInfo };
}

function calculateTotalVolume(flowReadings) {
  // Convert seconds to hours
  const timeInHours = flowReadings.length / 3600;

  // Calculate total volume
  const totalVolume = flowReadings.reduce((acc, flowRate) => acc + flowRate, 0) / 3600;

  // Return result
  return {
    elapsedTime: Number(timeInHours.toFixed(2)),
    volume: Number(totalVolume.toFixed(2))
  };
}

function calculateTimeAboveThreshold(flowReadings, threshold) {
  // Convert seconds to hours
  const timeInHours = flowReadings.length / 3600;

  // Calculate time running above the threshold
  const timeAboveThreshold = flowReadings.reduce((acc, flowRate) => {
    if (flowRate > threshold) {
      return acc + 1; // Assuming each reading represents 1 second
    }
    return acc;
  }, 0) / 3600;

  // Truncate results to two decimal places
  const truncatedTime = Number(timeInHours.toFixed(2));
  const truncatedTimeAboveThreshold = Number(timeAboveThreshold.toFixed(2));

  // Return result
  return {
    elapsedTime: Number(truncatedTime.toFixed(2)),
    timeRunning: Number(truncatedTimeAboveThreshold.toFixed(2))
  };
}



// Export the functions as properties of an object
module.exports = {
  extractValues,
  basicTrend,
  arrayDeltaComparator,
  calculateArrAverage,
  returnStatus,
  calculateTotalVolume,
  addArrays,
  analyzeTrend,
  calculateTimeAboveThreshold,

  // Add other functions here
};
