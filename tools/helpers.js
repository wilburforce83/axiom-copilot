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
  
  










  // Export the functions as properties of an object
  module.exports = {
    extractValues,
    basicTrend,
    // Add other functions here
  };
  