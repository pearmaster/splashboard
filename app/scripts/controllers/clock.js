'use strict';

(function () {

angular.module('splashboardApp').controller('ClockCtrl', function ($scope, $timeout, $interval) {

    var setClock = function() {
        var months = ['Jan.', 'Feb.', 'Mar.', 'April', 'May', 'June', 'July',
                      'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var d = new Date();
        var h = d.getHours() % 12;
        if (h === 0) {
            h = 12;
        }
        var m = d.getMinutes();
        if (m < 10) {
            m = '0' + m;
        }
        $scope.time = h + ':' + m;
        $scope.date = months[d.getMonth()] + ' ' + d.getDate();
    };
    var onFirstMinute = function () {
        setClock();
        $interval(setClock, 60*1000);
    };
    setClock();
    var next = new Date();
    next.setSeconds(0);
    next.setMinutes(next.getMinutes() + 1);
    $timeout(onFirstMinute, (next-(new Date())));
});

})();
