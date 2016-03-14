'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Camera = mongoose.model('Camera'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a camera
 */
exports.create = function (req, res) {
  var camera = new Camera(req.body);
  camera.user = req.user;

  camera.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(camera);
    }
  });
};

/**
 * Show the current camera
 */
exports.read = function (req, res) {
  res.json(req.camera);
};

/**
 * Update a camera
 */
exports.update = function (req, res) {
  var camera = req.camera;

  camera.title = req.body.title;
  camera.cam_url = req.body.cam_url;
  camera.description = req.body.description;

  camera.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(camera);
    }
  });
};

/**
 * Delete an camera
 */
exports.delete = function (req, res) {
  var camera = req.camera;

  camera.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(camera);
    }
  });
};

/**
 * List of Cameras
 */
exports.list = function (req, res) {
  Camera.find().sort('-created').populate('user', 'displayName').exec(function (err, cameras) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cameras);
    }
  });
};

/**
 * Camera middleware
 */
exports.cameraByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Camera is invalid'
    });
  }

  Camera.findById(id).populate('user', 'displayName').exec(function (err, camera) {
    if (err) {
      return next(err);
    } else if (!camera) {
      return res.status(404).send({
        message: 'No camera with that identifier has been found'
      });
    }
    req.camera = camera;
    next();
  });
};
