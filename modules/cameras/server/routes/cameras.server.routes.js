'use strict';

/**
 * Module dependencies.
 */
var camerasPolicy = require('../policies/cameras.server.policy'),
  cameras = require('../controllers/cameras.server.controller');

module.exports = function (app) {
  // Cameras collection routes
  app.route('/api/cameras').all(camerasPolicy.isAllowed)
    .get(cameras.list)
    .post(cameras.create);

  // Single camera routes
  app.route('/api/cameras/:cameraId').all(camerasPolicy.isAllowed)
    .get(cameras.read)
    .put(cameras.update)
    .delete(cameras.delete);

  // Finish by binding the camera middleware
  app.param('cameraId', cameras.cameraByID);
};
