  /* gplusapi.js - wrappers for API calls to Google+ */


  /**
    * performSearch
    * Sets up the search using the JS client and searches
    * 
    * @param searchPhrase
    *   The url-escaped search term.
    */
  function performSearch(searchPhrase){
    // Set parameters for the query
    gapi.client.plus.activities.search( 
        { 
          'query' : searchPhrase, 
          'pageToken' : nextPageToken, 
          'fields' : 'nextPageToken,items/published',
          'orderBy' : 'recent',
          'maxResults' : 20
        }
      ).execute(function(activities){
          if (activities != undefined && activities.items != undefined){
            for (activity in activities.items){
              postDate.push((now - Date.parse(activities.items[activity].published)) / 60000);
            }
            processActivities(activities);
          }else{
            searchHelper();
          }
        });
  }

  /** 
    * handleActivities 
    * Parses and stores activities from the query
    *
    * @param activities
    *    An activities list returned from an API call to activities.list.
    */
  function processActivities(activities){
    if (activities != undefined && activities.etag != undefined){
      nextPageToken = activities.nextPageToken.replace(/"/g,'');
    }

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
      // Throttle because limit of 10 QPS
      setTimeout(searchForActivities(), 100);
    }else{
      // we're done
      postDates.push(postDate);
      i++;
      searchHelper();
    }

    queryCount++;
    progressTracking[i] = progressTracking[i] - 1;
    updateProgress();
  }

  /**
    * searchForActivities
    * 
    * Given a query counts posts containing the phrase
    */
  function searchForActivities(){
    // Only load GAPI once and clean up the search
    if (gapi.client.plus == undefined){
      gapi.client.load('plus','v1', function(){

        // Set API Key / Client ID
        //gapi.auth.authorize( { client_id: clientId} );
        gapi.client.setApiKey( key );

        if (debug){
          console.log("token : " + nextPageToken);
          console.log("count : " + queryCount);
        }

        if (debug > 0){
          console.log(searchPhrase);
        }

        searchPhrase = searchPhrase.replace("#","%23");
        searchPhrase = trim(searchPhrase);

        performSearch(searchPhrase);
      });
    }else{
      performSearch(searchPhrase);
    }
  }
