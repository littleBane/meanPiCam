'use strict';

// Configuring the Cameras module
angular.module('cameras').run(['Menus',
  function (Menus) {
    // Add the cameras dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Cameras',
      state: 'cameras',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'cameras', {
      title: 'List Cameras',
      state: 'cameras.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'cameras', {
      title: 'Create Cameras',
      state: 'cameras.create',
      roles: ['user']
    });
  }
]);