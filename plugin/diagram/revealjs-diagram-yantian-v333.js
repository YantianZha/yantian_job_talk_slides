(function (window) {

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

function init(treeData) {
  width = window.parent.document.body.clientWidth - margin.right - margin.left;
  height = window.parent.document.body.clientHeight - margin.top - margin.bottom;

  tree = d3.tree() // Change from d3.layout.tree() to d3.tree()
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

  if (treeData) {
    update(treeData)
  }
}


  // D3 helpers
  function renderNodes(nodes, data) {
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.name });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      var x = d.parent !== undefined ? d.parent.y0 : data.y0;
      var y = d.parent !== undefined ? d.parent.x0 : data.x0;
      return "translate(" + x + "," + y + ")";
    });

  nodeEnter.append("circle")
    .attr("r", function(d) { return d.radius || radius; }) // Dynamic radius for circle shapes
    .style("fill", function(d) { return d.color || default_color; }); // Set fill color

  var text = nodeEnter.append('text')
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("opacity", 0)
    .style("font-size", "20px")
    .text(function (d) { return d.name.toUpperCase() });

  // Transition nodes to their new position.
  var nodeUpdate = node.merge(nodeEnter).transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
    .attr("r", function(d) { return d.radius || radius; }) // Dynamic radius for circle shapes
    .style("fill", function(d) { return d.color || default_color; }); // Set fill color

  nodeUpdate.select("text")
    .attr("opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      var x = d.parent !== undefined ? d.parent.y : data.y0;
      var y = d.parent !== undefined ? d.parent.x : data.x0;
      return "translate(" + x + "," + y + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 0);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);
  }

  function update(data) {
    // create the tree
    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);

    renderNodes(nodes, data);
  }

  window.diagram = {
    register: register,
    init: init,
    update: update,
    width: width,
    height: height
  };
})(window);