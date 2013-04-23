/* tagtracker.js - core app functionality and variables */

  var key = "YOUR_SIMPLE_KEY";

  // 0 ... 3 for messages, 0 is none, 3 is lots
  var debug = 3;

  // Strategies:
  // Note:  These strategies will set the minimum # of samples/time to get samples for
  // Chronological ("chron"): 
  //     Try and search for activities until a certain date threshold is reached
  //     Hours ago is usd to calculate the date threshold
  // Sample ("sample"):
  //     Sample x results from G+ and then try and fit them to a graph
  //     # samples is specified in sampleLimit
  // Hybrid ("hybrid"):
  //     Use a combination of sample/chron?
  var strategy = "chron";
  //var strategy = "sample";

  // For data retrieval
  var maxQueryCount = 100; // max # of queries to G+ per term

  // For charting, might not want these to be globals
  var seriesCount;
  var series;

  // If using chron strategy, time ago in minutes
  var timeAgoLimit = 60*4;
  var now;

  // If using sample strategy, # of samples to get
  var sampleLimit  = 50;

  // Time in minutes to bucket slots
  // TODO: is this better seved as a fraction of timeAgoLimit?
  var buckets = 10;
  var splitTime = timeAgoLimit / buckets;

  // application configuration
  var theCurveType = "none"; // none or function

  var postDates;
  var hashTags;
  var progressTracking;
  var progressBar;
  var calculating;

  // Globals used in child scripts (gplusapi.js)
  // TODO: class Use proper module pattern and encapsulate
  var i;
  var queryCount;
  var nextPageToken;
  var postDate;
  var searchPhrase;

// initialize - sets up all the variables that are used for getting data to chart
  function initialize(){
    document.getElementById("theProgressBar").style.width = "0%";
    document.getElementById("progressbarcontainer").style.display = "block";
    visualization.innerText = "";
    if (debug > 1){
      console.log("init");
    }

    postCounts = new Array();
    for (var i = 0; i < buckets; i++){
      postCounts.push(0);
    }

    series        = new Array();
    seriesCount   = 0;

    progressTracking = new Array();
  }
  function searchHelper(){
    if (i < hashTags.length){
      searchPhrase = hashTags[i];

      postDate = new Array();

      if (debug > 0){
        console.log(hashTags[i]);
      }

      // we'll decrement to roughly get an estimation of time remaining
      progressTracking[i] = maxQueryCount;
      queryCount = 0;
      // DO IT!

      searchForActivities();
    }
  }

  // queryTags - performs queries for all of the hashtags
  function queryTags(){
    if (calculating){return;}
    calculating = true;

    if (debug > 0){
      console.log("queryTags");
    }

    initialize();

    var queryTags = document.getElementById("thetag").value;

    hashTags = queryTags.split(",");

    console.log(hashTags);

    i=0;
    // initialize our timeframe and arrays of post dates
    now = Date.parse(Date());
    postDates = new Array();
    postDate = new Array();
    searchHelper();
  }

