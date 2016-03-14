'use strict';

//Cameras service used for communicating with the cameras REST endpoints
angular.module('cameras').factory('Cameras', ['$resource',
  function ($resource) {
    return $resource('api/cameras/:cameraId', {
      cameraId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
