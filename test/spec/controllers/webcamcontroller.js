'use strict';

describe('Controller: WebcamcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('splashboardApp'));

  var WebcamcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebcamcontrollerCtrl = $controller('WebcamcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
