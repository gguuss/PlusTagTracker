/* tagtracker.js - core app functionality and variables */
// ====   SETUP   ====
// Create a project from https://code.google.com/apis/console
// Add the Google+ service
// Use the API key here

// 0 ... 3 for messages, 0 is none, 3 is lots
// TODO @class Move to conf / globals
var debug = 0;
var key = "YOUR API KEY";

var TagTracker = (function () {

  var my = {};
  // ==== END SETUP ====



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
  my.strategy = "chron";
  //var strategy = "sample";

  // For data retrieval
  my.maxQueryCount = 100; // max # of queries to G+ per term

  // For charting, might not want these to be globals
  my.seriesCount;
  my.series;

  // If using chron strategy, time ago in minutes
  my.timeAgoLimit = 60*4;
  my.now;

  // If using sample strategy, # of samples to get
  my.sampleLimit  = 50;

  // Time in minutes to bucket slots
  // TODO: is this better seved as a fraction of timeAgoLimit?
  my.buckets = 10;
  my.splitTime = my.timeAgoLimit / my.buckets;

  // application configuration
  my.theCurveType = "none"; // none or function

  my.postDates;
  my.hashTags;
  my.progressTracking;
  my.progressBar;
  my.calculating;

  // Globals used in child scripts (gplusapi.js)
  // TODO: class Use proper module pattern and encapsulate
  my.i;
  my.queryCount;
  my.nextPageToken;
  my.postDate;
  my.searchPhrase;

 /**
  * initialize
  * Sets up all the variables that are used for getting data to chart.
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  my.initialize = function(showUI){
    if (showUI){
      document.getElementById("theProgressBar").style.width = "0%";
      document.getElementById("progressbarcontainer").style.display = "block";
      visualization.innerText = "";
    }

    if (debug > 1){
      console.log("init");
    }

    this.postCounts = new Array();
    for (var i = 0; i < this.buckets; i++){
      this.postCounts.push(0);
    }

    this.series        = new Array();
    this.seriesCount   = 0;

    this.progressTracking = new Array();
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
  my.queryTags = function (query, showUI){
    if (this.calculating){return;}
    this.calculating = true;

    if (debug > 0){
      console.log("queryTags");
    }

    this.initialize(showUI);

    var queryTags = query;
    if (query == undefined){
      queryTags = document.getElementById("thetag").value;
    }

    this.hashTags = queryTags.split(",");

    console.log(this.hashTags);

    this.i=0;
    // initialize our timeframe and arrays of post dates
    this.now = Date.parse(Date());
    this.postDates = new Array();
    this.postDate = new Array();
    searchHelper(showUI);
  };

  return my;
}());
