
/*
Copyright (c) 2015 Artillery Games, Inc. All rights reserved.

This source code is licensed under the MIT-style license found in the
LICENSE file in the root directory of this source tree.
 */
var Slack, createHandler, getenv, handler, http, options, server, slack;
Slack = require('node-slack');
http = require('http');
cfenv = require('cfenv');
createHandler = require('github-webhook-handler');

// Load environment vars from .env if local
var appEnv = cfenv.getAppEnv();
if (appEnv.isLocal)
  require('dotenv').load();

slack = new Slack(process.env.SLACK_WEBHOOK_URL);

handler = createHandler({
  path: '/webhook',
  secret: process.env.GITHUB_WEBHOOK_SECRET
});

server = http.createServer(function(req, res) {
  return handler(req, res, function(err) {
    res.statusCode = 404;
    return res.end('nothing to see here, move along');
  });
});

server.listen(appEnv.port, function() {
  var ref = server.address(),
      address = ref.address,
      family = ref.family,
      port = ref.port;
  return console.log("Listening on " + address + ":" + port + " via " + family);
});

handler.on('error', function(err) {
  return console.error("WebHook handler error:", err);
});

handler.on('gollum', function(event) {
  var p, page;
  p = event.payload;
  var multPages = (p.pages.length > 1) ? "s" : "";
  var text = "<" + p.repository.html_url + "/wiki|[" + p.repository.name + " wiki]> " +
             p.pages.length + " update" + multPages + " by " + p.sender.login + ":";


  var attachmentText = "";
  for (var i=0; i < p.pages.length; i++) {
    page = p.pages[i];
    attachmentText += "<" + page.html_url + "/" + page.sha + "|" + page.page_name + "> " + page.action;
    attachmentText += (i !== p.pages.length - 1) ? "\n" : "";
  }
  var attachment = [
    {
      "pretext": "`" + p.pages[0].sha.substr(0,6) + "`",
      "text": attachmentText,
      "color": "#5aaafa",
      "mrkdwn_in": ["pretext"]
    }
  ];

  return slack.send({
    text: text,
    attachments: attachment
  });
});
