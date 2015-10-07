// +---------------------------------------------------------------------------
// +  Datei: js/app.js    UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Application logic, for the onsite Skript.
// +  KorrektorIn:
// +  Status:
// +  Revision: 2014/07/28
// +---------------------------------------------------------------------------
'use strict'

// + Set Image Path for Leaflet:
L.Icon.Default.imagePath = "images/";

// + Set up the Namespace for Freifunk.
var app = {};
// + Set up the "global" data store for the app
app.data = {};

// + These two vars store the current user and node count. Updated every 15s.
app.data.onlineUserCount = 0;
app.data.onlineNodeCount = 0;
app.data.offlineNodeCount = 0;
app.data.nodesTotal = 0;
app.data.nodesWithGeo = 0;
app.data.map = null;
app.data.retrievedFromJson = {};

// +---------------------------------------------------------------------------
// + Register Events (behaviur)
// +---------------------------------------------------------------------------
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
	app.getCurrentStats();
	setInterval(function() {
		app.getCurrentStats();
	},15 * 1000);

    var options = {
        zoom: 10,
        center: [51.505,-0.09],
        scrollWheelZoom: false
    };

    app.data.map = app.View.Map(jQuery,"map");
    app.data.map.init(options);

  })
  .on("usersupdated", function () {
		console.log("Online users: " + app.data.onlineUserCount);
        $('#users-online').text(app.data.onlineUserCount);
	})
  .on("geonodesupdated", function() {
        console.log("Online Nodes: " + app.data.onlineNodeCount);
        console.log("Nodes with GEO: " + app.data.nodesWithGeo);

        $('#nodes-online').text(app.data.onlineNodeCount + " (" + app.getPercent(
          app.data.nodesTotal,app.data.onlineNodeCount).toFixed(2).replace(".",",") + "%)");
        $('#nodes-offline').text(app.data.offlineNodeCount + " (" + app.getPercent(
          app.data.nodesTotal,app.data.offlineNodeCount).toFixed(2).replace(".",",") + "%)");
        $('#nodes-with-geolocation').text(app.data.nodesWithGeo + " (" + app.getPercent(
          app.data.nodesTotal,app.data.nodesWithGeo).toFixed(2).replace(".",",") + "%)");

        app.processNodes(app.data.map);
    })
    .on("nodesupdated", function () {
        $('#nodes-total').text(app.data.nodesTotal);
        console.log("Nodes: " + app.data.nodesTotal);
    });



// +---------------------------------------------------------------------------
// + Current Stats
// + - Use our proxy.php to get the Current number of Users online
// + @fires: event on document: "usersupdated" Whenever the function completes 
// + a successfull Ajax request. 
// +---------------------------------------------------------------------------
app.getCurrentStats = function () {
  $.get("proxy.php",function(json) {
    app.data.retrievedFromJson = JSON.parse(json);

    var nodes = [];
    $.each(app.data.retrievedFromJson.nodes, function(index, node){
      nodes.push(node);
    });

    var date = new Date(app.data.retrievedFromJson.timestamp);
    var onlineNodes = nodes.filter(function(d) {
      return d.flags.online;
      }).length,
    nNodes = nodes.filter(function(d) {
            return !d.flags.gateway;
        }).length,
    nGateways = nodes.filter(function(d) {
      return d.flags.gateway && d.flags.online;
      }).length,
      nClients = nodes.reduce(function(previusValue, currentValue){
        if(typeof(previusValue) !== "number") {
          previusValue = 0;
        }
        return previusValue + currentValue.statistics.clients;
      }),
    geoNodes = nodes.filter(function(d) {
            return d.nodeinfo.location;
        }).length;
    // + When the pased data differs from the current: update the values
    // + and trigger the event.
    if(app.data.onlineUserCount !== (nClients)){

      app.data.onlineUserCount = nClients;
      $(document).trigger("usersupdated");
    }
    if(app.data.nodesTotal !== nNodes) {
      app.data.nodesTotal = nNodes;
      $(document).trigger("nodesupdated");
    }
    if(app.data.onlineNodeCount !== onlineNodes || app.data.nodesWithGeo !== geoNodes) {
        app.data.onlineNodeCount = onlineNodes;
        app.data.nodesWithGeo = geoNodes;
        app.data.offlineNodeCount = nNodes - onlineNodes;
        $(document).trigger("geonodesupdated");
    }
  });
};

app.getPercent = function(base, share) {
  if(base && share){
    return (100 / base) * share;
  }
  else {
    return 0.0;
  }

};

app.processNodes = function (map) {
    if(map) {
            var data = app.data.retrievedFromJson;

            map.flushCluster();
          $.each(data.nodes, function(index, node){
                var lat, long, online, name, category;
                // Get Data out of the node.
                if(node.nodeinfo.location) {
                    lat = node.nodeinfo.location.latitude;
                    long = node.nodeinfo.location.longitude;
                    if(node.flags) {
                        online = node.flags.online;
                    }
                    if(node.nodeinfo){
                        name = node.nodeinfo.name;
                    }
                    map.addClusterMarker(lat,long,online,name, node.clientcount, node.lastseen);
                }

            });
    }

};

// TODO: Ajax Fail abfangen,