/* Use worker to allow us to run AStar over very large metrics without killing the main browser thread */

importScripts("/graph.js", "/astar.js", "AStar_memtronic.js");
random = Math.random;
floor  = Math.floor;

function AStarTest(width,height) {
  this.width = width;
  this.height = height;
  this.setup();
}

AStarTest.prototype = {
  setup: function() {
    var width = this.width,
        height = this.height,
        grid = new Array(height);

    for (var i = 0; i < height; ++i) {
      grid[i] = new Array(width);
      for (var j = 0; j < width; ++j) {
        grid[i][j] = (j * i) % 7 ? floor(random() * 200) % 2 : 0;
      }
    }

    this.grid = grid;
  },
  runPathFinders: function(startPt, endPt) {
    var results = [];
    var grid = this.grid;
    var graph = new Graph(grid);
    var x = endPt[0], y = endPt[1];
    var start = graph.nodes[startPt[0]][startPt[1]];
    var end = graph.nodes[endPt[0]][endPt[1]];
    var stime = new Date();
    astar.search(this.grid, start, end);
    var etime = new Date();

    results.push(['astar.search', (etime - stime)]);

    var types = ["Manhattan", "Diagonal", "Euclidean", "DiagonalFree", "EuclideanFree"];
    for (var i = 0, len = types.length; i < len; ++i) {
      var type = types[i];
      stime = new Date();
      AStar(grid, [0,0], [x,y], type);
      etime = new Date();
      results.push([type, (etime - stime)]);
    }
    return results;
  }
}

onmessage = function(event) {
  var testcase = new AStarTest(event.data.width, event.data.height)

  // find the path from 0, 0 to 10 random locations
  //var results = new Array(10);
  var trials = {};
  var result;

  for (var i = 0; i < 10; ++i) {
    var y = parseInt(random()*testcase.height), 
        x = parseInt(random()*testcase.width);
    testcase.grid[y][x]= 0; // make sure it's open

    result = testcase.runPathFinders([0,0],[x,y]);
    for (var j = 0, len = result.length; j < len; ++j) {
      if (trials[result[j][0]] == undefined) { trials[result[j][0]] = 0; }
      trials[result[j][0]] += result[j][1];
    }
  }

  // compute the average of 10 trials
  for (var i in trials) {
    trials[i] /= 10;
  }

  postMessage(trials);
}
