'use strict';

(function () {

angular.module('splashboardApp')
.controller('BackgroundCtrl', function ($scope, $http, $interval, ipCookie, Webcam, $timeout, preferences, VariableInterval) {

    $scope.backgroundUrl = null;
    $scope.backgroundCaption = '';
    $scope.backgroundImages = [];
    $scope.showingIndex = ipCookie('slideshow_index');
    if (!$scope.showingIndex) {
        $scope.showingIndex = 0;
    }

    var slideshowInterval = null;

    var loadAlbums = function () {
        if (angular.isArray(preferences.photos)) {
            angular.forEach(preferences.photos, function(photo) {
                $scope.backgroundImages.push(photo);
            });
        }

        var albums = angular.copy(preferences.picasa);
        console.log('Loading albums', albums);
        var loadAnAlbum = function () {
            if (albums.length > 0) {
                var albumUrl = albums.shift();
                console.log('Loading album', albumUrl);
                $http.get(albumUrl).success(function (data, status, headers, config) {
                    angular.forEach(data.feed.entry, function(element) {
                        var photoUrl = element.media$group.media$content[0].url;
                        var photoUrlParts = photoUrl.split('/');
                        var filename = photoUrlParts.pop();
                        photoUrlParts.push('s' + window.screen.width);
                        photoUrlParts.push(filename);
                        photoUrl = photoUrlParts.join('/');
                        $scope.backgroundImages.push(photoUrl);
                    });
                    loadAnAlbum();
                    $scope.slideshowRunning = true;
                }).error(function (data, status, headers, config) {
                    console.log('Error locading ', albumUrl, status);
                });
            }
        };
        loadAnAlbum();
    };

    $scope.incrementPhotoIndex = function() {
        $scope.showingIndex++;
        ipCookie('slideshow_index', $scope.showingIndex, { expires: 21 });
        return $scope.showingIndex % $scope.backgroundImages.length;
    };

    $scope.nextPhoto = function() {
        if ($scope.backgroundImages.length === 0) {
            console.log('No background images available to display');
            scheduleNextPhoto();
            return;
        }
        console.log('Setting next photo');
        if ($scope.mode === 'photo') {
            var url = $scope.backgroundImages[$scope.incrementPhotoIndex()];
            console.log('Setting background url to ' + url);
            $scope.backgroundUrl = url;
        }
    };

    var scheduleNextPhoto = function () {
        console.log('Scheduling next photo', preferences.delay);
        $timeout(function () {
            $scope.nextPhoto();
        }, preferences.delay);
    };

    $scope.$on('imageplaced', function () {
        scheduleNextPhoto();
    });

    $scope.$watch('mode', function (newval, oldval) {
        console.log('New mode change ' + oldval + ' -> ' + newval);
        if (newval === 'photo') {
            scheduleNextPhoto();
        }
    });

    loadAlbums();

});

})();
