/* gplusapi.js - wrappers for API calls to Google+ */

// performXHR - used to trigger the XMLHttpRequest
  function performXHR(URL, postDate, query, i, queryCount, nextPageToken){
    if (debug > 1){
      console.log("xhr_call");
      console.log(postDate);
    }
    var objReturn = "";      
    var request = new XMLHttpRequest();

    request["postdate"] = postDate;
    request["query"] = query;
    request["i"] = i;
    request["querycount"] = queryCount;
    request["nextpagetoken"] = nextPageToken;

    request.open('GET', URL, true);
    request.send(); // because of "false" above, will block until the request is done 
                    // and status is available. Not recommended, however it works for simple cases.

    request.onreadystatechange = function(){ 
      if (request.readyState == 4) {
        var postDate = request["postdate"];
        var query = request["query"];
        var i = request["i"];
        var queryCount = request["querycount"]
        var nextPageToken = request["nextpagetoken"];
        if (debug > 2){
          console.log("handled");
          console.log(postDate);
          console.log(query);
          console.log(i);
          console.log(queryCount);
          console.log(nextPageToken);
          console.log("end handled");
        }

        var activities = JSON.parse(request.responseText).items;
        nextPageToken = JSON.parse(request.responseText).nextPageToken;

        if (debug > 2){
          for (value in activities){
            console.log(value);
          }
        }

        for (activity in activities){        
          postDate.push((now - Date.parse(activities[activity].published)) / 60000);
        }

        return handleActivities(activities, postDate, query, i, queryCount, nextPageToken);
      }else{
        //handleRequestIssue(request);
      }
    };
    //return handleActivities(objReturn, postDate, query, i);
  }

// handleActivities - Parses and stores activities from the XMLHttpRequest
  function handleActivities(activities, postDate, query, i, queryCount, nextPageToken){

    console.log("handle : " + nextPageToken);
    console.log("handle : " + queryCount);
    console.log("handle : " + postDate);

    if (  
      (queryCount < maxQueryCount) 
      && 
      // 1) Chronological strategy
      (
        (strategy == "chron" && (postDate[postDate.length - 1] < timeAgoLimit))
        || 
        // 2) Sample strategy
        (strategy == "sample" && (postDate.length < sampleLimit))
      )
    ){
      queryCount++;
      progressTracking[i] = progressTracking[i] - 1;
      updateProgress();
      // Throttle because limit of 10 QPS
      if (debug > 1){console.log("next query: " + queryCount);}

      setTimeout(searchForActivities(query, postDate, i, queryCount, nextPageToken), 100);
    }else{
      if (debug > 1){
        console.log("posting: " + i);
      }
      postDates[i] = postDate;
      progressTracking[i] = 0;
      updateProgress();
      //bucketDatesForChart(postDates);
    }
  }

  function searchForActivities(searchPhrase, postDate, i, queryCount, nextPageToken){
    if (debug){
      console.log("search : " + nextPageToken);
      console.log("search : " + queryCount);
    }

    var activities = "";

    if (debug > 0){
      console.log(searchPhrase);
    }

    searchPhrase = searchPhrase.replace("#","%23");
    searchPhrase = trim(searchPhrase);


    // Set parameters for the query
    var URL        = "https://www.googleapis.com/plus/v1/activities?query=" + searchPhrase 
      + "&key=" + key 
      + "&orderBy=recent&pageToken="+nextPageToken;

    performXHR(URL, postDate, searchPhrase, i, queryCount, nextPageToken);
  }
