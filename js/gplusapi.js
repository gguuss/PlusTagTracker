  /* gplusapi.js - wrappers for API calls to Google+ */


 /**
  * performSearch
  * Sets up the search using the JS client and searches
  *
  * @param searchPhrase
  *   The url-escaped search term.
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function performSearch(searchPhrase, showUI){
    // Set parameters for the query
    gapi.client.plus.activities.search(
        {
          'query' : TagTracker.searchPhrase,
          'pageToken' : TagTracker.nextPageToken,
          'fields' : 'nextPageToken,items/published',
          'orderBy' : 'recent',
          'maxResults' : 20
        }
      ).execute(function(activities){
          if (activities.code != undefined){
            console.log("Error while fetching activities!", activities.error);
          }else{
            if (activities != undefined && activities.items != undefined){
              for (activity in activities.items){
                TagTracker.postDate.push((TagTracker.now -
                  Date.parse(activities.items[activity].published)) / 60000);
              }
              processActivities(activities, showUI);
            }else{
              searchHelper(showUI);
            }
          }
        });
  }

 /**
  * searchHelper
  * Performs parts of a query.
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function searchHelper(showUI){
    if (TagTracker.i < TagTracker.hashTags.length){
      TagTracker.searchPhrase = TagTracker.hashTags[TagTracker.i];

      TagTracker.postDate = new Array();

      if (debug > 0){
        console.log(TagTracker.hashTags[TagTracker.i]);
      }

      // we'll decrement to roughly get an estimation of time remaining
      TagTracker.progressTracking[TagTracker.i] = TagTracker.maxQueryCount;
      TagTracker.queryCount = 0;

      searchForActivities(showUI);
    }
  }

 /**
  * handleActivities
  * Parses and stores activities from the query
  *
  * @param activities
  *    An activities list returned from an API call to activities.list.
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function processActivities(activities, showUI){
    if (activities != undefined && activities.etag != undefined){
      TagTracker.nextPageToken = activities.nextPageToken.replace(/"/g,'');
    }

    if (
      (TagTracker.queryCount < TagTracker.maxQueryCount)
      &&
      // 1) Chronological strategy
      (
        (TagTracker.strategy == "chron" && (
          TagTracker.postDate[TagTracker.postDate.length - 1] <
          TagTracker.timeAgoLimit))
        ||
        // 2) Sample strategy
        (TagTracker.strategy == "sample" && (TagTracker.postDate.length <
          TagTracker.sampleLimit))
      )
    ){
      // Throttle because limit of 10 QPS
      setTimeout(searchForActivities(showUI), 100);
    }else{
      // we're done
      TagTracker.postDates.push(TagTracker.postDate);
      TagTracker.i++;
      searchHelper(showUI);
    }

    TagTracker.queryCount++;
    TagTracker.progressTracking[TagTracker.i] =
      TagTracker.progressTracking[TagTracker.i] - 1;
    updateProgress(showUI);
  }

 /**
  * searchForActivities
  * Given a query counts posts containing the phrase
  *
  * @param showUI
  * If true, renders to the client; otherwise, runs headless.
  */
  function searchForActivities(showUI){
    // Only load GAPI once and clean up the search
    if (gapi.client.plus == undefined){
      gapi.client.load('plus','v1', function(){

        // Set API Key / Client ID
        //gapi.auth.authorize( { client_id: clientId} );
        gapi.client.setApiKey( key );

        if (debug){
          console.log("token : " + TagTracker.nextPageToken);
          console.log("count : " + TagTracker.queryCount);
        }

        if (debug > 0){
          console.log(TagTracker.searchPhrase);
        }

        TagTracker.searchPhrase = TagTracker.searchPhrase.replace("#","%23");
        TagTracker.searchPhrase = trim(TagTracker.searchPhrase);

        performSearch(TagTracker.searchPhrase, showUI);
      });
    }else{
      performSearch(TagTracker.searchPhrase, showUI);
    }
  }
