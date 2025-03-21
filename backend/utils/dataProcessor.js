
//Utility functions for processing SEPTA data


/** 
 * Calculates delay status based on minutes late
 * @param {number} minutesLate - Minutes the train is delayed
 * @returns {string} Status description
 */
function getDelayStatus(minutesLate) {
    if (minutesLate <= 0) return 'On Time';
    if (minutesLate <= 5) return 'Slightly Delayed';
    if (minutesLate <= 15) return 'Moderately Delayed';
    return 'Severely Delayed';
  }
  
  /**
   * Processes raw train data to a consistent format
   * @param {Object} rawTrain - Raw train data from SEPTA API
   * @returns {Object} Processed train data
   */
  function processTrain(rawTrain) {
    const delay = parseInt(rawTrain.late, 10);
    
    return {
      trainNumber: rawTrain.trainno,
      line: rawTrain.line,
      destination: rawTrain.dest,
      nextStop: rawTrain.nextstop,
      delay: delay,
      status: getDelayStatus(delay),
      coordinates: {
        lat: parseFloat(rawTrain.lat),
        lon: parseFloat(rawTrain.lon)
      },
      service: rawTrain.service,
      direction: rawTrain.direction,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Filters trains by line
   * @param {Array} trains - Array of train objects
   * @param {string} line - Line ID to filter by
   * @returns {Array} Filtered trains
   */
  function filterTrainsByLine(trains, line) {
    if (!line) return trains;
    return trains.filter(train => train.line.toLowerCase() === line.toLowerCase());
  }
  
  /**
   * Gets only delayed trains
   * @param {Array} trains - Array of train objects
   * @param {number} threshold - Minimum delay in minutes to be considered delayed
   * @returns {Array} Delayed trains
   */
  function getDelayedTrains(trains, threshold = 1) {
    return trains.filter(train => train.delay >= threshold);
  }
  
  module.exports = {
    getDelayStatus,
    processTrain,
    filterTrainsByLine,
    getDelayedTrains
  };