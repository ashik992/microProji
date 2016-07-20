'use strict';

var Os = require('os');
var Https = require('https');
var fs = require('fs');

var Configuration = require('./config');

var filePath = './readme.md';

var projectId = Configuration.projectId;
var stories = Configuration.stories;
var promises = [];

stories.forEach(function (story) {
  var requestOptions = {
    host: 'www.pivotaltracker.com',
    path: '/services/v5/projects/' + projectId +
    '/stories/' + story,
    method: 'GET',
    headers: {
      'X-TrackerToken': Configuration.apiToken
    }
  };
  var promise = new Promise(function (resolve, reject) {
    var data = '';
    var req = Https.request(requestOptions, function (res) {
      res.setEncoding('utf8');


      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        resolve(JSON.parse(data));
      });
    });
    req.end();

    req.on('err', function (err) {
      reject(err);
    });
  });

  promises.push(promise);
});

Promise
  .all(promises)
  .then(function (storyData) {
    var documentation = '| Issue # | Point | Description | Status | Comments |' + Os.EOL +
      '|:--------:|:--------:|-----------|:------:|:--------|' + Os.EOL;

    storyData.forEach(function forEachStory(story) {
      var sotryStatus;

      switch(story.current_state) {
        case 'delivered' : 
          sotryStatus = 'Completed';
          break;
        case 'started' : 
          sotryStatus = 'Continue';
          break;
        default:
          sotryStatus = '';
      }

      var docLine = '| [#' + story.id +
          '](https://www.pivotaltracker.com/story/show/' + story.id +
          ') | ' + story.estimate +
          ' | ' + story.name +
          ' | ' + sotryStatus +
          ' |  |';

      documentation += docLine + Os.EOL
    });

    fs.writeFile(filePath, documentation, function(err, data){
      if (err) {
        console.error(err);
      } else {
        console.log('Status is written in', filePath);
      }
    })
  })
  .catch(function (ex) {
    console.error(ex);
  });
