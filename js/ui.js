 /* ui.js - functionality related to UI */

 /**
  * updateProgress
  * updates the UI and determines whether the chart should be rendered.
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function updateProgress(showUI){
    var countsLeft = 0;
    for (var i=0; i < progressTracking.length; i++){
      countsLeft += progressTracking[i];
    }
    if (countsLeft > 0){
      if (debug > 1){
        console.log("not finished, continuing");
      }

      console.log(document.getElementById("theProgressBar"));

      var percent = 100 - Math.floor((countsLeft / (maxQueryCount * hashTags.length)) * 100);
      var progressBar = document.getElementById("theProgressBar");

      if (strategy == "sample"){
        // TODO: if this makes sense, should just count # samples/sampleLimit
        //percent =
      }

      if (showUI){
        document.getElementById("theProgressBar").style.width = percent + "%";
      }

    }else{
      renderContent();
    }
  }
 /**
  * toggleStrategy
  * Changes the strategy used for collecting samples/posts/activities
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function toggleStrategy(){
    if (strategy == "chron"){
      strategy = "sample";
    }else{
      theCurveType = "chron";
    }
  }

 /**
  * toggleLineType
  * Turns on the silly curved lines for charts.
  */
  function toggleLineType(){
    if (theCurveType == "function"){
      theCurveType = "none";
    }else{
      theCurveType = "function";
    }
  }

 /**
  * updateHoursAgo
  * Sets the # of hours to sample data for when using the
  * chronological strategy
  */
  function updateHoursAgo(){
    var hours    = parseInt(document.getElementById("thehours").value);
    timeAgoLimit = hours * 60;
    splitTime    = timeAgoLimit / buckets;
    if (debug > 2){
      console.log("timeAgoLimit now: " + timeAgoLimit);
      console.log("splitTime now: " + splitTime);
    }
  }

 /**
  * updateSampleLimit
  * Sets the # of samples to retrieve when using the
  * sample strategy.
  */
  function updateSampleLimit(){
    sampleLimit = parseInt(document.getElementById("samplesLimit").value);

  }
