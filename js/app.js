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

// +---------------------------------------------------------------------------
// + Register Events (behaviur)
// +---------------------------------------------------------------------------
$(document).ready(function () {
	app.getCurrentStats();
	setInterval(function() {
		app.getCurrentStats();
	},15 * 1000);
  })
  .on("usersupdated", function () {
		console.log(app.data.onlineUserCount);
	})



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
    var nNodes = data.nodes.filter(function(d) {
      return !d.flags.client && d.flags.online;
      }).length,
    nLegacyNodes = data.nodes.filter(function (d) {
      return !d.flags.client && d.flags.online && d.flags.legacy;
      }).length,
    nGateways = data.nodes.filter(function(d) {
      return d.flags.gateway && d.flags.online;
      }).length,
    nClients = data.nodes.filter(function(d) {
      return d.flags.client && d.flags.online;
      }).length;
  
    app.data.onlineNodeCount = nNodes;
    app.data.onlineUserCount = nClients - nLegacyNodes;
    $(document).trigger("usersupdated");
  });
};

// TODO: Ajax Fail abfangen, 
// TODO: Render Funktion schreiben, die werte aus dem Data objekt nett visualisiert.
