'use strict';

angular.module('splashboardApp')
.factory('Webcam', function($http) {
    return function(url) {
        var webcamObj = this;
        this.url = url;
        var referenceImage = null;
        var newImage = null;
        this.getLatest = function(callback) {
            console.log('Getting latest webcam image', url);
            $http.get(url, {responseType: 'blob'}).success(function(data) {
                if (referenceImage === null) {
                    referenceImage = data;
                } else {
                    newImage = data;
                }
                if (newImage !== null) {
                    /*resemble(referenceImage).compareTo(newImage).onComplete(
                        function(data) {
                            var diff = parseFloat(data.misMatchPercentage);
                            callback(webcamObj, diff);
                        }
                    );*/
                } else {
                    callback(webcamObj, 0);
                }
            }).error(function(data, status, headers, config) {
                console.log('There was an error loading webcam image', url);
            });
        };
        this.reset = function(callback) {
            if (newImage !== null) {
                referenceImage = newImage;
            }
        };
    };
});
