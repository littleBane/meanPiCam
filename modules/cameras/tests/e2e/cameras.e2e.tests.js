'use strict';

describe('Cameras E2E Tests:', function () {
  describe('Test cameras page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cameras');
      expect(element.all(by.repeater('camera in cameras')).count()).toEqual(0);
    });
  });
});
