'use strict';

(function () {

angular.module('splashboardApp')
.controller('WeatherCtrl', function ($scope, $http, $interval, preferences) {

    var loadWeather = function() {
        var zip = null;
        if (('zip' in preferences) && (preferences.zip !== 0)) {
            zip = preferences.zip;
        }
        if (zip !== null) {
            var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.bylocation%20where%20location%3D%22' + zip + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
            $http({method: 'GET', url: url}).success(function(data, status, headers, config) {
                $scope.condition = data.query.results.weather.rss.channel.item.condition;
                console.log('Weather Data', $scope.condition);
            });
        }
    };
    $interval(loadWeather, 10*60*1000); // reload weather eery 10 minutes

    $scope.iconCodes = [];
    $scope.iconCodes[3] = '&amp;';
    $scope.iconCodes[4] = '6';
    $scope.iconCodes[11] = '7';
    $scope.iconCodes[12] = '7';
    $scope.iconCodes[14] = '"';
    $scope.iconCodes[17] = '$';
    $scope.iconCodes[18] = '$';
    $scope.iconCodes[24] = 'F';
    $scope.iconCodes[26] = '5';
    $scope.iconCodes[27] = '5';
    $scope.iconCodes[28] = '5';
    $scope.iconCodes[29] = '4';
    $scope.iconCodes[30] = '3';
    $scope.iconCodes[31] = '2';
    $scope.iconCodes[32] = '1';
    $scope.iconCodes[33] = '4';
    $scope.iconCodes[34] = '3';
    $scope.iconCodes[37] = '6';
    $scope.iconCodes[38] = '6';
    $scope.iconCodes[39] = '6';
    $scope.iconCodes[47] = '6';

    loadWeather();
});

})();
