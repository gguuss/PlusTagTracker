**Notice** [Google+ API is shutting down on March 7th, 2019](https://developers.google.com/+/api-shutdown).

# TagTracker
Demonstrates how to use the Google+ activities API to read public data and monitor the activity stream.

## Setup
* Edit js/tagtracker and replace the key variable with your own Google+ API credentials from https://code.google.com/apis/console
* Deploy the sources to your web server
* Open the page in the web server and enter a tag to track
* Tracked tags will be graphed over time based on the configuration

## Demo
There is a live demo here: http://wheresgus.com/tagtracker

Inside the demo I have added a few experimental options:
* Use a sample strategy - this will use the number of activities instead of a time span
* Change the duration that you will be pulling data for when using the time cutoff
* Draw lines as curves
