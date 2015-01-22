// +---------------------------------------------------------------------------
// +  Datei: js/app.js    UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Application logic, for the onsite Skript.
// +  KorrektorIn:
// +  Status:
// +  Revision: 2014/07/28
// +---------------------------------------------------------------------------
'use strict'

// + Set up the Namespace for Freifunk.
var app = {};
// + Set up the "global" data store for the app
app.data = {};

// + These two vars store the current user and node count. Updated every 15s.
app.data.onlineUserCount = 0;
app.data.onlineNodeCount = 0;
app.data.nodesTotal = 0;
app.data.nodesWithGeo = 0;
app.data.map = null;

// +---------------------------------------------------------------------------
// + Register Events (behaviur)
// +---------------------------------------------------------------------------
$(document).ready(function () {
	app.getCurrentStats();
	setInterval(function() {
		app.getCurrentStats();
	},15 * 1000);

    app.data.map = app.View.Map(jQuery,"map");
    app.data.map.init();

  })
  .on("usersupdated", function () {
		console.log("Online users: " + app.data.onlineUserCount);

	})
  .on("geonodesupdated", function() {
        console.log("Online Nodes: " + app.data.onlineNodeCount);
        console.log("Nodes with GEO: " + app.data.nodesWithGeo);

        app.data.map.flushCluster();
        app.processNodes(app.data.map);
    })
    .on("nodesupdated", function () {
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
                    // Category:
                    if(online) {
                        category = 1;
                    } else {
                        category = 2;
                    }

                    map.addClusterMarker(lat,long,category,name);
                }

            });

        });
    }

};

// TODO: Ajax Fail abfangen, 
// TODO: Render Funktion schreiben, die werte aus dem Data objekt nett visualisiert.
