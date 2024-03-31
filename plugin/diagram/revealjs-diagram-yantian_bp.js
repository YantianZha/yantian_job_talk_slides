(function (window) {
    // Configurations
    var duration = 750;
    var margin = {top: 20, right: 200, bottom: 20, left: 200};
    var padding = 10;
    var radius = 10;
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
        registered[name] = {
            name: name,
            cb: cb
        }
    }

    function init(treeData) {
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

        if (treeData) {
            update(treeData)
        }
    }

    // Private methods
    function findNode(name, nodes) {
        var node = nodes.shift();
        if (node.name === name) {
            return node;
        }
        if (node.children) {
            nodes = nodes.concat(node.children);
        }
        return findNode(name, nodes)
    }

    // D3 helpers
    function renderNodes(nodes, data) {
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.name });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr({
                class: "node",
                transform: function(d) {
                    var x = d.parent !== undefined ? d.parent.y0 : data.y0;
                    var y = d.parent !== undefined ? d.parent.x0 : data.x0;
                    return "translate(" + x + "," + y + ")";
                }
            });

        nodeEnter.append("rect")
            .attr({
                width: 0,
                height: 0,
                x: 0,
                y: 0,
                rx: radius,
                ry: radius
            })
            .style("fill", function(d) { return d.color; }); // Use color property

        var text = nodeEnter.append('text')
            .attr({
                'text-anchor': 'middle',
                'alignment-baseline': 'middle',
                opacity: 0
            })
            .style({
                'font-size': '20px'
            })
            .text(function (d) {return d.name.toUpperCase()});

        // ...
    }

    function update(data) {
        // create the tree
        var nodes = tree.nodes(treeData);
        var links = tree.links(nodes);

        renderNodes(nodes, data);

        // update links
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.name; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: d.source.x0, y: d.source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: d.source.x, y: d.source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // transition standalone links
        renderStandaloneLinks(_randomLinks);

        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }

    window.diagram = {
        register: register,
        init: init,
        update: update
    };
})(window);
