'use strict';

(function () {

var parsePolygonString = function(s) {
    var results = [];
    var pts = s.split(' ');
    angular.forEach(pts, function(pt) {
        var p = pt.split(',');
        results.push([parseFloat(p[0]), parseFloat(p[1])]);
    });
    return results;
};

var pointInPolygon = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
};

angular.module('splashboardApp')
.controller('AlertCtrl', function ($scope, $http, $interval, preferences) {

    $scope.alert = {
        active:false,
        text:'Loading alerts',
        color:'red'
    };

    var zip = null;
    var lat;
    var lon;
    var setLatLon = function (zipcode) {
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20centroid.latitude%2C%20centroid.longitude%20from%20geo.places%20where%20text%3D'+zipcode+'%20and%20country.code%3D%22US%22&format=json';
        return $http({method: 'GET', url: url}).success(function (data) {
            console.log('Coords are', data);
            lat = parseFloat(data.query.results.place.centroid.latitude);
            lon = parseFloat(data.query.results.place.centroid.longitude);
        });
    };

    var getZoneAlerts = function (zipcode) {
        var d = new Date();
        var datestamp = '' + d.getUTCFullYear() + d.getUTCMonth() + d.getUTCDay() + d.getUTCMinutes();
        var url = 'http://query.yahooapis.com/v1/public/yql/pearmaster/wx-alert?zipcode=' + zipcode + '&format=json&_maxage=80&_ds' + datestamp;
        console.log('Loading zone alerts from', url);
        return $http({method: 'GET', url: url});
    };

    var getCountyAlerts = function (zipcode) {
        var d = new Date();
        var datestamp = '' + d.getUTCFullYear() + d.getUTCMonth() + d.getUTCDay() + d.getUTCMinutes();
        var url = 'http://query.yahooapis.com/v1/public/yql/pearmaster/wx-alert-county?zipcode=' + zipcode + '&format=json&_maxage=80&_ds' + datestamp;
        console.log('Loading county alerts from' + url);
        return $http({method: 'GET', url: url});
    };

    var currentAlerts = {county: [], zone: []};

    var findBestAlert = function() {
        console.log('Finding best alert out of ' + currentAlerts.county.length +
                ' county alerts and '+ currentAlerts.zone.length + ' zone alerts');
        var severities = ['none', 'Unknown', 'Minor', 'Moderate', 'Strong', 'Severe', 'Extreme'];
        var urgencies = ['none', 'Unknown', 'Past', 'Future', 'Expected', 'Immediate'];
        var best = {severity: 'none'};
        angular.forEach(currentAlerts.county, function(alert) {
            if (('polygon' in alert) && angular.isString(alert.polygon) && (alert.polygon.length > 3)) {
                var p = parsePolygonString(alert.polygon);
                if (pointInPolygon([lat, lon], p)) {
                    console.log('We are inside the provided polygon', alert.polygon);
                } else {
                    console.log('The polygon doesnt include this point', alert.polygon, lat, lon);
                    return;
                }
            }
            console.log('County alert for '+lat+' and '+lon, alert);
            if (severities.indexOf(alert.severity) > severities.indexOf(best.severity)) {
                best = alert;
            }
        });
        angular.forEach(currentAlerts.zone, function(alert) {
            console.log('Zone alert:', alert);
            if (severities.indexOf(alert.severity) > severities.indexOf(best.severity)) {
                best = alert;
            }
        });
        if (severities.indexOf(best.severity) >= severities.indexOf('Minor')) {
            return best;
        }
        return {};
    };

    var showAlert = function(entry) {
        try {
            $scope.alert.active = (entry.msgType === 'Alert');
            var validUntil = new Date(Date.parse(entry.expires));
            var rightNow = new Date();
            var expireString = '';
            if (validUntil.getDay() === (rightNow.getDay()+1)) {
                expireString = 'tomorrow at ';
            } else if (validUntil.getDay() !== rightNow.getDay()) {
                expireString += ['Sunday', 'Monday', 'Tuesday',
                    'Wednesday', 'Thursday', 'Friday',
                    'Saturday'][validUntil.getDay()] + ' at ';
            }
            var ampm = 'pm';
            if (validUntil.getHours() >= 0 && validUntil.getHours() < 12) {
                ampm = 'am';
            }
            var hrs = (validUntil.getHours() % 12);
            if (validUntil.getHours() === 0 || validUntil.getHours() === 12) {
                hrs = '' + 12;
            }
            var mins = validUntil.getMinutes();
            if (mins < 10 && mins > 0) {
                mins = '0' + mins;
            }
            expireString += hrs;
            if (mins > 0) {
                expireString += ':' + mins;
            }
            expireString += ampm;
            $scope.alert.text = entry.event + ' until ' + expireString;
        } catch(e) {
            console.log('Caught', e);
            $scope.alert.active = false;
        }
    };

    var showBestAlert = function() {
        var entry = findBestAlert();
        showAlert(entry);
    };

    var showCountyAlerts = function () {
        getCountyAlerts(zip).success(function(data, status, headers, config) {
            console.log('county alerts', data);
            if (data.query.count > 0) {
                if (angular.isArray(data.query.results.entry)) {
                    currentAlerts.county = data.query.results.entry;
                } else {
                    currentAlerts.county = [data.query.results.entry];
                }
                showBestAlert();
            }
        }).error(function(data, status, headers, config) {
            console.error('County alerts error', data);
        });
    };

    var showZoneAlerts = function () {
        getZoneAlerts(zip).success(function(data, status, headers, config) {
            if (data.query.count > 0) {
                if (angular.isArray(data.query.results.entry)) {
                    currentAlerts.zone = data.query.results.entry;
                } else {
                    currentAlerts.zone = [data.query.results.entry];
                }
            }
            showBestAlert();
        }).error(function(data, status, headers, config) {
            console.error('Error getting alerts ', data, status, headers);
        });
    };


    if (('zip' in preferences) && (preferences.zip !== 0)) {
        zip = preferences.zip;
    }

    if (zip !== null) {
        setLatLon(zip).success(function() {
            $interval(showZoneAlerts, 10*60*1000);
            $interval(showCountyAlerts, 1.5*60*1000);
            showZoneAlerts();
            showCountyAlerts();
        });
    }

    $scope.alert.active = false;

});


})();
