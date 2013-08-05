/* utility.js - Various utility functions */

   /**
    * findMaxCount
    * Determine the largest bucket of entries
    *
    * @param buckets
    *   An array containing counts of entries.
    *
    * @return The maximum value in the array.
    */
    function findMaxCount(buckets){
      var maxValue = 0;
      for (var index in buckets){
        if (buckets[index] > maxValue){
          maxValue = buckets[index];
        }
      }
      return maxValue;
    }

   /**
    * findOldestEntry
    * Find the oldest value in a series
    *
    * @param someSeries
    *   The chart series [series][bucket][millis] to find the oldest entry of.
    *
    * @return The maximum value from the chart series.
    */
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

   /**
    * From stack overflow / blog.stevenlevithan.com
    * a javascript trim function
    *
    * @param str The string to trim.
    *
    * @return The trimmed string.
    */
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

   /**
    * getChartDateTime
    * Turn milliseconds limits into entries to be used on chart
    *
    * @param Time in milliseconds.
    *
    * @return Formatted date.
    */
    function getChartDateTime(millis){
      var days = ["Sun","Mon","Tues","Wed","Thur","Fri","Sat"];
      var thisDate = new Date(now - millis);


      var prettyDate = days[thisDate.getDay()] + ", " + thisDate.getHours() + ":"
          + (thisDate.getMinutes() < 10 ? "0" : "")
          + thisDate.getMinutes();

      return prettyDate;
    }
