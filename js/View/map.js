var app = app || {};
app.View = app.View || {};
// +---------------------------------------------------------------------------
// + Map View. Make sure to only init the map once on the same el.
// +---------------------------------------------------------------------------

// TODO: Make dynamic map container via constructor.
app.View.Map = function ($, mapID) {
    // ++ Private vars and functions.

    var tagName = 'div',
        lat = 51.505,
        lon = -0.09,
        map = {},
        pruneCluster = {},
        markers = {},
        mapID = mapID || "",
        init = function (options) {
            // + Init the Map and set View bounds to center of Mannheim.
            map = L.map(mapID, options).setView([49.47704787438876, 8.5638427734375]);

            // + Set the tile Layer and add to map.
            //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);


            // +--- Init the prune Cluste Plugin for Leaflet: https://github.com/SINTEF-9012/PruneCluster---------------
            pruneCluster = new PruneClusterForLeaflet();
            markers = new L.FeatureGroup(pruneCluster); // TODO: Get View Bounds via Feature Group - currently unused.

            // + Make a custom Icon for the Cluster. Also Taken from: https://github.com/SINTEF-9012/PruneCluster
            pruneCluster.BuildLeafletClusterIcon = function (cluster) {
                var e = new L.Icon.MarkerCluster();
                e.stats = cluster.stats;
                e.population = cluster.population;
                return e;
            };
            // + Colors for the Categories, starting with 0 to 7.
            var colors = ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'],
                pi2 = Math.PI * 2;

            L.Icon.MarkerCluster = L.Icon.extend({
                options: {
                    iconSize: new L.Point(44, 44),
                    className: 'prunecluster leaflet-markercluster-icon'
                },
                createIcon: function () {
                    // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
                    var e = document.createElement('canvas');
                    this._setIconStyles(e, 'icon');
                    var s = this.options.iconSize;
                    e.width = s.x;
                    e.height = s.y;
                    this.draw(e.getContext('2d'), s.x, s.y);
                    return e;
                },
                createShadow: function () {
                    return null;
                },
                draw: function (canvas, width, height) {
                    var lol = 0;
                    var start = 0;
                    for (var i = 0, l = colors.length; i < l; ++i) {
                        var size = this.stats[i] / this.population;
                        if (size > 0) {
                            canvas.beginPath();
                            canvas.moveTo(22, 22);
                            canvas.fillStyle = colors[i];
                            var from = start + 0.14,
                                to = start + size * pi2;
                            if (to < from) {
                                from = start;
                            }
                            canvas.arc(22, 22, 22, from, to);
                            start = start + size * pi2;
                            canvas.lineTo(22, 22);
                            canvas.fill();
                            canvas.closePath();
                        }
                    }
                    canvas.beginPath();
                    canvas.fillStyle = 'white';
                    canvas.arc(22, 22, 18, 0, Math.PI * 2);
                    canvas.fill();
                    canvas.closePath();
                    canvas.fillStyle = '#555';
                    canvas.textAlign = 'center';
                    canvas.textBaseline = 'middle';
                    canvas.font = 'bold 12px sans-serif';
                    canvas.fillText(this.population, 22, 22, 40);
                }
            });

            // + Finally add the pruneCluster to the map Object.
            map.addLayer(pruneCluster);
        }

    var addClusterMarker = function (latitude, longitude, category, name) {
        // + Get all the Arguments.
        var latitude = latitude,
            longitude = longitude,
            category = category || 0,
            name = name || "";

        if (latitude && longitude) {

            var marker = new PruneCluster.Marker(latitude, longitude);
            marker.category = category;
            marker.data.name = name;
            pruneCluster.RegisterMarker(marker);

        }
        // + Every Change on the cluster requires the call of this function:
        pruneCluster.ProcessView();

    }

    var flushCluster = function () {
        pruneCluster.RemoveMarkers();
        pruneCluster.ProcessView();
    }
    // Public object:
    var public = {
        init: init,
        addClusterMarker: addClusterMarker,
        flushCluster: flushCluster
    }
    return public;
};

