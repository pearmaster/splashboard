'use strict';

describe('Service: Webcam', function () {

  // load the service's module
  beforeEach(module('splashboardApp'));

  // instantiate service
  var Webcam;
  beforeEach(inject(function (_Webcam_) {
    Webcam = _Webcam_;
  }));

  it('should do something', function () {
    expect(!!Webcam).toBe(true);
  });

});
