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
    for (var i=0; i < TagTracker.progressTracking.length; i++){
      countsLeft += TagTracker.progressTracking[i];
    }
    if (countsLeft > 0){
      if (debug > 1){
        console.log("not finished, continuing");
      }

      console.log(document.getElementById("theProgressBar"));

      var percent = 100 - Math.floor((countsLeft /
        (TagTracker.maxQueryCount * TagTracker.hashTags.length)) * 100);
      var progressBar = document.getElementById("theProgressBar");

      if (TagTracker.strategy == "sample"){
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
    if (TagTracker.strategy == "chron"){
      TagTracker.strategy = "sample";
    }else{
      TagTracker.theCurveType = "chron";
    }
  }

 /**
  * toggleLineType
  * Turns on the silly curved lines for charts.
  */
  function toggleLineType(){
    if (TagTracker.theCurveType == "function"){
      TagTracker.theCurveType = "none";
    }else{
      TagTracker.theCurveType = "function";
    }
  }

 /**
  * updateHoursAgo
  * Sets the # of hours to sample data for when using the
  * chronological strategy
  */
  function updateHoursAgo(){
    var hours    = parseInt(document.getElementById("thehours").value);
    TagTracker.timeAgoLimit = hours * 60;
    TagTracker.splitTime    = TagTracker.timeAgoLimit / TagTracker.buckets;
    if (debug > 2){
      console.log("timeAgoLimit now: " + TagTracker.timeAgoLimit);
      console.log("splitTime now: " + TagTracker.splitTime);
    }
  }

 /**
  * updateSampleLimit
  * Sets the # of samples to retrieve when using the
  * sample strategy.
  */
  function updateSampleLimit(){
    TagTracker.sampleLimit =
      parseInt(document.getElementById("samplesLimit").value);

  }
