'use strict';

// Cameras controller
angular.module('cameras').controller('CamerasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cameras',
  function ($scope, $stateParams, $location, Authentication, Cameras) {
    $scope.authentication = Authentication;

    // Create new Camera
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'cameraForm');

        return false;
      }

      // Create new Camera object
      var camera = new Cameras({
        title: this.title,
        cam_url: this.cam_url,
        description: this.description
      });

      // Redirect after save
      camera.$save(function (response) {
        $location.path('cameras/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.cam_url = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Camera
    $scope.remove = function (camera) {
      if (camera) {
        camera.$remove();

        for (var i in $scope.cameras) {
          if ($scope.cameras[i] === camera) {
            $scope.cameras.splice(i, 1);
          }
        }
      } else {
        $scope.camera.$remove(function () {
          $location.path('cameras');
        });
      }
    };

    // Update existing Camera
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'cameraForm');

        return false;
      }

      var camera = $scope.camera;

      camera.$update(function () {
        $location.path('cameras/' + camera._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Cameras
    $scope.find = function () {
      $scope.cameras = Cameras.query();
    };

    // Find existing Camera
    $scope.findOne = function () {
      $scope.camera = Cameras.get({
        cameraId: $stateParams.cameraId
      });
    };
  }
]);
