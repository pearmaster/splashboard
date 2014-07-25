'use strict';

var splashboardApp = angular.module('splashboardApp', ['ivpusic.cookie', 'backsplash']);

splashboardApp.value('preferences', {
    picasa: ['http://picasaweb.google.com/data/feed/base/user/112870609367691483673/albumid/5699371792810315905?alt=json&kind=photo&hl=en_US'],
    webcams: [],
    images: [],
    zip: 0,
    delay: 5000,
    nightmode: [23, 6]
});


angular.element(document).ready(function () {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var pattern = /[0-9a-zA-Z_\/.\-]+/g;
    var result = pattern.exec(location.hash);

    var runApp = function (data) {
        splashboardApp.run(function(preferences) {
            angular.forEach(preferences, function(val, key) {
                if (key in data) {
                    preferences[key] = data[key];
                }
            });
            if (preferences.zip === 0) {
                var zipcodePattern = /[0-9]{5}/g;
                var result = zipcodePattern.exec(location.hash);
                if (result !== null) {
                    console.log('Setting zip code from hash', result);
                    preferences.zip = result[0];
                } else {
                    console.log('Could not find zip code in hash', location.hash);
                }
            }
            console.log('preferences', preferences);
        });
        angular.bootstrap(document, ['splashboardApp']);
    };

    if (result !== null) {
        var throughyahoo = false;
        var url = result + '.json';
        if (result[0].charAt(0) === '/') {
            url = result;
            if (result[0].charAt(1) === '/') {
                throughyahoo = true;
                url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A' + encodeURIComponent(result) + '%22&format=json';
            }
        }
        console.log('Loading preferences from ' + url);
        $http.get(url).success(function(data) {
            if (throughyahoo) {
                if (data.query.results) {
                    data = data.query.results.json;
                } else {
                    data = null;
                }
            }
            console.log('Config is', data);
            if (data === null) {
                data = [];
            }
            runApp(data);
        }).error(function (data) {
            console.error('Could not load config file', url);
            runApp([]);
        });
    } else {
        runApp([]);
    }
});
