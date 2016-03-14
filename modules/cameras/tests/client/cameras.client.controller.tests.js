'use strict';

(function () {
  // Cameras Controller Spec
  describe('Cameras Controller Tests', function () {
    // Initialize global variables
    var CamerasController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Cameras,
      mockCamera;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Cameras_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Cameras = _Cameras_;

      // create mock camera
      mockCamera = new Cameras({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Camera about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Cameras controller.
      CamerasController = $controller('CamerasController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one camera object fetched from XHR', inject(function (Cameras) {
      // Create a sample cameras array that includes the new camera
      var sampleCameras = [mockCamera];

      // Set GET response
      $httpBackend.expectGET('api/cameras').respond(sampleCameras);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.cameras).toEqualData(sampleCameras);
    }));

    it('$scope.findOne() should create an array with one camera object fetched from XHR using a cameraId URL parameter', inject(function (Cameras) {
      // Set the URL parameter
      $stateParams.cameraId = mockCamera._id;

      // Set GET response
      $httpBackend.expectGET(/api\/cameras\/([0-9a-fA-F]{24})$/).respond(mockCamera);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.camera).toEqualData(mockCamera);
    }));

    describe('$scope.create()', function () {
      var sampleCameraPostData;

      beforeEach(function () {
        // Create a sample camera object
        sampleCameraPostData = new Cameras({
          title: 'An Camera about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Camera about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Cameras) {
        // Set POST response
        $httpBackend.expectPOST('api/cameras', sampleCameraPostData).respond(mockCamera);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the camera was created
        expect($location.path.calls.mostRecent().args[0]).toBe('cameras/' + mockCamera._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/cameras', sampleCameraPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock camera in scope
        scope.camera = mockCamera;
      });

      it('should update a valid camera', inject(function (Cameras) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/cameras\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/cameras/' + mockCamera._id);
      }));

      it('should set scope.error to error response message', inject(function (Cameras) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/cameras\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(camera)', function () {
      beforeEach(function () {
        // Create new cameras array and include the camera
        scope.cameras = [mockCamera, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/cameras\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCamera);
      });

      it('should send a DELETE request with a valid cameraId and remove the camera from the scope', inject(function (Cameras) {
        expect(scope.cameras.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.camera = mockCamera;

        $httpBackend.expectDELETE(/api\/cameras\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to cameras', function () {
        expect($location.path).toHaveBeenCalledWith('cameras');
      });
    });
  });
}());
