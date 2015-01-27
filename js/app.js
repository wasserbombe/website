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

        $('#nodes-online').text(app.data.onlineNodeCount);
        $('#nodes-offline').text(app.data.offlineNodeCount);
        $('#nodes-with-geolocation').text(app.data.nodesWithGeo);

        app.data.map.flushCluster();
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
    var data = JSON.parse(json);
    var date = new Date(data.meta.timestamp);
    var onlineNodes = data.nodes.filter(function(d) {
      return !d.flags.client && d.flags.online;
      }).length,
    nNodes = data.nodes.filter(function(d) {
            return !d.flags.client && !d.flags.gateway;
        }).length,
    nLegacyNodes = data.nodes.filter(function (d) {
      return !d.flags.client && d.flags.online && d.flags.legacy;
      }).length,
    nGateways = data.nodes.filter(function(d) {
      return d.flags.gateway && d.flags.online;
      }).length,
    nClients = data.nodes.filter(function(d) {
      return d.flags.client && d.flags.online;
      }).length,
    geoNodes = data.nodes.filter(function(d) {
            return d.geo;
        }).length;
    // + When the pased data differs from the current: update the values
    // + and trigger the event.
    if(app.data.onlineUserCount !== (nClients -nLegacyNodes)){

      app.data.onlineUserCount = nClients - nLegacyNodes;
      $(document).trigger("usersupdated");
    }
    if(app.data.onlineNodeCount !== onlineNodes || app.data.nodesWithGeo !== geoNodes) {
        app.data.onlineNodeCount = onlineNodes;
        app.data.nodesWithGeo = geoNodes;
        app.data.offlineNodeCount = nNodes - onlineNodes;
        $(document).trigger("geonodesupdated");
    }
    if(app.data.nodesTotal !== nNodes) {
        app.data.nodesTotal = nNodes;
        $(document).trigger("nodesupdated");
    }
  });
};

app.processNodes = function (map) {
    if(map) {
        $.get("proxy.php",function(json) {
            var data = JSON.parse(json);


            data.nodes.forEach(function(node){
                var lat, long, online, name, category;
                // Get Data out of the node.
                if(node.geo) {
                    lat = node.geo[0];
                    long = node.geo[1];
                    if(node.flags) {
                        online = node.flags.online;
                    }
                    if(node.name){
                        name = node.name;
                    }


                    map.addClusterMarker(lat,long,online,name, node.clientcount, node.lastseen);
                }

            });

        });
    }

};

// TODO: Ajax Fail abfangen, 
// TODO: Render Funktion schreiben, die werte aus dem Data objekt nett visualisiert.
