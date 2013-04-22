/* chart.js - various functions for formatting data for the chart */

// renderContent - prepares the data for the chart and renders it
  function renderContent(){
    if (strategy == "sample"){
      timeAgoLimit = findOldestEntry(postDates);
      splitTime    = timeAgoLimit / buckets;
    }

    for (var index=0; index<postDates.length; index++){
      if (postDates[index] != undefined){
        bucketDatesForChart(postDates[index], hashTags[index]);
      }
    }

    if (debug > 1){
      console.log(i);
      console.log(postDates);
    }

    document.getElementById("progressbarcontainer").style.display = "none";

    drawVisualization();
    calculating = false;
  }

// bucketDatesForChart - places activity counts into the posts array for
//   graphing later
  function bucketDatesForChart(postDate, currQuery){
    if (debug > 1){
      console.log("bucketdates");
      console.log("splitTime: " + splitTime);
    }

    var postCounts = new Array();
    for (var index=0; index <= buckets; index++){
      postCounts.push(0);
    }

    if (debug > 0){
      console.log("postcounts");
    }

    for (index in postDate){
      var bucket = Math.floor(postDate[index] / splitTime);
      console.log("bucket is " + bucket);
      if (bucket <= 10){
        postCounts[bucket] = postCounts[bucket]+1;
      }
    }

    if (debug > 0){
      console.log(postCounts);
    }

    // first (last, actually but we'll reverse) element of series 
    // is label
    postCounts.push(currQuery);

    // currently ordered newest to oldest, want oldest to newest
    if (debug > 0){
      console.log("saving");
    }
    series[seriesCount] = postCounts.reverse();
    seriesCount += 1;
  }

// drawVisualization - renders the chart
  function drawVisualization() {
    if (debug > 0){
      console.log("draw");
    }

    // Create and populate the data table.
    // x-axis label, y-axis label (1), y-axis label (2)
    // series 1,     value1,           value2
    //
    var keySeries = ["Hashtag",getChartDateTime(timeAgoLimit * 60000)];

    // Calculate the largest number of hits for this search
    var highValue  = 0;
    for (var index=0; index<series.length; index++){
      var tempHigh = findMaxCount(series[index]);
      if (tempHigh > highValue){
        highValue = tempHigh;
      }
    }

    // calculate the x-axis labels
    for (var index=0; index < buckets; index++){
      var millisSplit = (timeAgoLimit - (splitTime * (index+1))) * 60000;
      keySeries.push(getChartDateTime(millisSplit));
    }

    var dataSet = new Array();

    // Matrix rotation
    // Column becomes row
    for (var index in keySeries){
      dataSet[index] = new Array();

      dataSet[index][0] = keySeries[index];
      for (var seriesNum in series){
        dataSet[index][parseInt(seriesNum)+1] = series[seriesNum][index];
      }

    }

    if (debug > 1){
      console.log(dataSet);
    }

    var data = google.visualization.arrayToDataTable(dataSet);

    // Create and draw the visualization.
    new google.visualization.LineChart(document.getElementById('visualization')).
      draw(data, {
                  curveType: theCurveType,
                  width: 650, height: 300,
                  vAxis: {maxValue: highValue}
                 }
          );
      // end draw
    // end new
  }
