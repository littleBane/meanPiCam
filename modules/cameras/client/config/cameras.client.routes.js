'use strict';

// Setting up route
angular.module('cameras').config(['$stateProvider',
  function ($stateProvider) {
    // cameras state routing
    $stateProvider
      .state('cameras', {
        abstract: true,
        url: '/cameras',
        template: '<ui-view/>'
      })
      .state('cameras.list', {
        url: '',
        templateUrl: 'modules/cameras/client/views/list-cameras.client.view.html'
      })
      .state('cameras.create', {
        url: '/create',
        templateUrl: 'modules/cameras/client/views/create-camera.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('cameras.view', {
        url: '/:cameraId',
        templateUrl: 'modules/cameras/client/views/view-camera.client.view.html'
      })
      .state('cameras.edit', {
        url: '/:cameraId/edit',
        templateUrl: 'modules/cameras/client/views/edit-camera.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
