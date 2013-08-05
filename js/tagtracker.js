  /* tagtracker.js - core app functionality and variables */

  // ====   SETUP   ====
  // Create a project from https://code.google.com/apis/console
  // Add the Google+ service
  // Use the API key here
  var key = "YOUR_API_KEY";
  // ==== END SETUP ====


  // 0 ... 3 for messages, 0 is none, 3 is lots
  var debug = 1;

  // Strategies:
  // Note:  These strategies will set the minimum # of samples/time to get
  //     samples for Chronological ("chron"):
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

 /**
  * initialize
  * Sets up all the variables that are used for getting data to chart.
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function initialize(showUI){
    if (showUI){
      document.getElementById("theProgressBar").style.width = "0%";
      document.getElementById("progressbarcontainer").style.display = "block";
      visualization.innerText = "";
    }

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

 /**
  * queryTags
  * Performs queries for all of the hashtags.
  *
  * @param query
  * The comma delimited tags to search for.
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function queryTags(query, showUI){
    if (calculating){return;}
    calculating = true;

    if (debug > 0){
      console.log("queryTags");
    }

    initialize(showUI);

    var queryTags = query;
    if (query == undefined){
      queryTags = document.getElementById("thetag").value;
    }

    hashTags = queryTags.split(",");

    console.log(hashTags);

    i=0;
    // initialize our timeframe and arrays of post dates
    now = Date.parse(Date());
    postDates = new Array();
    postDate = new Array();
    searchHelper(showUI);
  }

