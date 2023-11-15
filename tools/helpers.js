// helper.js

// Function to extract "v" values from the data array
function extractValues(data) {
    // Check if the input data is an array
    if (!Array.isArray(data)) {
      throw new Error('Input data must be an array');
    }
  
    // Use the map function to create a new array with only the "v" values
    const valuesArray = data.map(item => item.v);
  
    return valuesArray;
  }
  
 // Function to determine the trend of an array of numbers
 function basicTrend(numbers, percentageThreshold) {
    if (!Array.isArray(numbers) || numbers.length < 2) {
      throw new Error('Input must be an array with at least two numbers');
    }
  
    if (typeof percentageThreshold !== 'number' || percentageThreshold <= 0) {
      throw new Error('Percentage threshold must be a positive number');
    }
  
    const lastValue = numbers[numbers.length - 1];
    const firstValue = numbers[0];
  
    const percentageDifference = ((lastValue - firstValue) / firstValue) * 100;
  
    if (percentageDifference > percentageThreshold) {
      return 'trending up';
    } else if (percentageDifference < -percentageThreshold) {
      return 'trending down';
    } else {
      return 'flat trend';
    }
  }

  function arrayDeltaComparator(dataArr1, dataArr2) {
    // Calculate the average of each array
    const avg1 = calculateAverage(dataArr1);
    const avg2 = calculateAverage(dataArr2);
    const delta = avg1 - avg2;
  
    // Compare the averages
    if (avg1 > avg2) {
      return {info : "nett increase between", delta : delta};
    } else if (avg1 < avg2) {
      return {info : "nett decrease between", delta : delta};
    } else {
      return {info : "no nett difference between", delta : delta};
    }
  }
  
  function calculateArrAverage(arr) {
    if (arr.length === 0) {
      return 0;
    }
  
    const sum = arr.reduce((acc, num) => acc + num, 0);
    return sum / arr.length;
  }


  function returnStatus(value, threshold) {  // e.g. pump flow rate value, and threshold to be classed as running i.e. 30, 5 - will return yes.
    if (arg1 > arg2) {
        return "yes";
    } else {
        return "no";
    }
}


  // Export the functions as properties of an object
  module.exports = {
    extractValues,
    basicTrend,
    arrayDeltaComparator,
    calculateArrAverage,
    returnStatus

    // Add other functions here
  };
  