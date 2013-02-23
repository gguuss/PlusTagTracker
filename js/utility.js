/* utility.js - Various utility functions */


// findMaxCount - determine the largest bucket of 
// entries
    function findMaxCount(buckets){
      var maxValue = 0;
      for (var index in buckets){
        if (buckets[index] > maxValue){
          maxValue = buckets[index];
        }
      }
      return maxValue;
    }

// findOldestEntry - find the oldest value in a series
    function findOldestEntry(someSeries){
      var maxValue = 0;
      for (seriesNum in someSeries){
        var aSeries = someSeries[seriesNum]
        for (var index in aSeries){
          if (aSeries[index] > maxValue){
            maxValue = aSeries[index];
          }
        }
      }
      return maxValue;
    }

// From stack overflow / blog.stevenlevithan.com
// a javascript trim function
    function trim (str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }

// getChartDateTime - turn milliseconds limits into entries
// to be used on chart
    function getChartDateTime(millis){
      var days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
      var thisDate = new Date(now - millis);


      var prettyDate = days[thisDate.getDay()] + ", " + thisDate.getHours() + ":" 
          + (thisDate.getMinutes() < 10 ? "0" : "")
          + thisDate.getMinutes();

      return prettyDate;
    }
