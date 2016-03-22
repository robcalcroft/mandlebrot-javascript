// Yeah, Jetty!
var Jetty = require("jetty");

// Create a new Jetty object. This is a through stream with some additional
// methods on it. Additionally, connect it to process.stdout
var jetty = new Jetty(process.stdout);

// Clear the screen
jetty.clear();

// Draw a circle with fly colours
var i = 0;
setInterval(function() {
  i += 0.025;

  var x = Math.round(Math.cos(i) * 25 + 50),
      y = Math.round(Math.sin(i) * 13 + 20);

  jetty.rgb(
    Math.round(Math.random() * 215),
    Math.random() > 0.5
  ).moveTo([y,x]).text(".");
}, 5);
