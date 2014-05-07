'use strict';

angular.module('splashboardApp')
.controller('WebcamcontrollerCtrl', function ($scope, Webcam, $timeout, preferences) {
 /*   var webcamUrls = preferences.webcams;
    if (angular.isString(webcamUrls)) {
        webcamUrls = [webcamUrls];
    }

    angular.forEach(webcamUrls, function(webcamUrl) {
        var cam = new Webcam(webcamUrl);
        var handleCamDiff = function(cam, diff) {
            console.log('Webcam Difference', webcamUrl, diff);
            if (diff > 10) {
                if ($scope.showingWebcam === null) {
                    $timeout($scope.showWebcam, 500);
                }
                showingWebcamStart = new Date();
                showingWebcam = cam;
                cam.reset();
            }
        };

        var doWebcamPoll = function() {
            cam.getLatest(handleCamDiff);
            $timeout(doWebcamPoll, 1000);
        };
        doWebcamPoll();
    });*/
});
