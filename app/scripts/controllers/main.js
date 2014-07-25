'use strict';

var splashboardApp = angular.module('splashboardApp');


splashboardApp.controller('AppController', function($scope, preferences, $timeout) {
    $scope.title = 'Splashboard';
    $scope.mode = 'none';

    var switchNightMode = function () {
        var now = new Date();
        var start = new Date();
        start.setHours(preferences.nightmode[0]);
        start.setMinutes(0);
        start.setSeconds(0);
        var end = new Date();
        end.setHours(preferences.nightmode[1]);
        end.setMinutes(0);
        end.setSeconds(0);
        var delay = 300;
        if (end < start) {
            if (now.getHours() < end.getHours()) {
                start.setDate(start.getDate() - 1);
            } else {
                end.setDate(end.getDate() + 1);
            }
        }
        console.log('Nightmode between ' + start.toString() + ' and ' + end.toString());
        if ((now >= start) && (now < end)) {
            console.log('Nightmode is on');
            $scope.mode = 'night';
            delay = (end - now);
        } else {
            console.log('Nightmode is off');
            $scope.mode = 'photo';
            if (now >= end) {
                start.setDate(start.getDate() + 1);
            }
            delay = (start - now);
        }
        if (window.brightness) {
            if ($scope.mode === 'night') {
                window.brightness.set(15);
            } else {
                window.brightness.set(100);
            }
        }
        console.log('Mode=' + $scope.mode + ' changes in ' + (delay/60000) + ' minutes');
        $timeout(switchNightMode, delay);
    };

    if ('nightmode' in preferences && angular.isArray(preferences.nightmode) && preferences.nightmode.length === 2) {
        switchNightMode();
    }

    if ('alarm' in preferences && angular.isArray(preferences.alarm) && preferences.alarm.length === 2) {
        var alarmTime = new Date();
        alarmTime.setHours(preferences.alarm[0]);
        alarmTime.setMinutes(preferences.alarm[1]);
        var now = new Date();
        if (alarmTime < now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        var timeDiff = alarmTime - now;
        console.log('Alarm will play in ' + (timeDiff/60000) + ' minutes');
        $timeout(function () {
            console.log('Now playing alarm');
            var audio = new Audio('thirdparty/alarm.wav');
            audio.play();
        }, timeDiff);
    }
});

splashboardApp.factory('VariableInterval', function ($interval) {
    return function (func, delay) {
        var _func = func;
        var _delay = delay;
        var _promise = null;
        var _lastRun = new Date();
        var thisVarInterv = this;
        var reset = function () {
            thisVarInterv.cancel();
            var _promise = $interval(_func, _delay);
            _promise.success(keepTime);
        };
        var keepTime = function () {
            _lastRun = new Date();
        };
        this.setInterval = function(newDelay) {
            _delay = newDelay;
            var n = new Date();
            if (newDelay < (n - _lastRun)) {
                thisVarInterv.cancel();
                _func();
            }
            reset();
        };
        this.cancel = function () {
            if (_promise !== null) {
                $interval.cancel(_promise);
                _promise = null;
            }
        };
        reset();
    };
});

splashboardApp.factory('AtTime', function ($timeout) {
    return function (func, datetime) {
        var d = new Date();
        var delta = datetime - d;
        return $timeout(func, delta);
    };
});
