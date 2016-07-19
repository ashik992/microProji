'use strict';

var Os = require('os');
var Https = require('https');

var Configuration = require('./config');

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
    var documentation = '';

    storyData.forEach(function forEachStory(story) {
      var docLine = '| [#' + story.id +
          '](https://www.pivotaltracker.com/story/show/' + story.id +
          ') | ' + story.estimate +
          ' | ' + story.name +
          ' | ' + story.current_state.charAt(0).toUpperCase() +
          story.current_state.slice(1) +
          ' |  |';

      documentation += docLine + Os.EOL
    });

    console.log(documentation);
  })
  .catch(function (ex) {
    console.error(ex);
  });
