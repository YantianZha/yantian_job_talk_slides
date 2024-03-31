(function(window) {
  // Configurations
  var duration = 750;
  var margin = {top: 20, right: 200, bottom: 20, left: 200};
  var padding = 10;
  var radius = 40;
  var default_color = '#FFFFFF';
  var width;
  var height;
  var tree;
  var svg;
  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  $('document').ready(function() {

    Object.keys(registered).forEach(function (k) {
      registered[k].cb();
    });

  });

  var registered = {};
  function register(name, cb) {
    console.log('register', name)
    registered[name] = {
      name: name,
      cb: cb
    }
  }

  // Append SVG block defining the arrowhead marker to the SVG element
  function appendArrowheadMarker(svg) {
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");
  }


  function init() {
    width = window.parent.document.body.clientWidth - margin.right - margin.left;
    height = window.parent.document.body.clientHeight - margin.top - margin.bottom;

    tree = d3.layout.tree()
      .size([height, width]);

    svg = d3.select("body").append("svg")
      .attr({
        width: width + margin.right + margin.left,
        height: height + margin.top + margin.bottom
      })
      .append("g")
      .attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
      });

    appendArrowheadMarker(svg); // Append arrowhead marker

    // Add random links
    var root = {x: height / 2, y: width / 2};
    for (var i = 0; i < 10; i++) {
      var randomX = Math.random() * width;
      var randomY = Math.random() * height;
      svg.append('line')
        .attr({
          "class": "arrow",
          "marker-end": "url(#arrowhead)",
          "x1": root.x,
          "y1": root.y,
          "x2": randomX,
          "y2": randomY
        });
    }
  }

  window.diagram = {
    register: register,
    init: init,
    width: width,
    height: height
  };
})(window);
