'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Camera = mongoose.model('Camera'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, camera;

/**
 * Camera routes tests
 */
describe('Camera CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new camera
    user.save(function () {
      camera = {
        title: 'Camera Title',
        content: 'Camera Content'
      };

      done();
    });
  });

  it('should be able to save an camera if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new camera
        agent.post('/api/cameras')
          .send(camera)
          .expect(200)
          .end(function (cameraSaveErr, cameraSaveRes) {
            // Handle camera save error
            if (cameraSaveErr) {
              return done(cameraSaveErr);
            }

            // Get a list of cameras
            agent.get('/api/cameras')
              .end(function (camerasGetErr, camerasGetRes) {
                // Handle camera save error
                if (camerasGetErr) {
                  return done(camerasGetErr);
                }

                // Get cameras list
                var cameras = camerasGetRes.body;

                // Set assertions
                (cameras[0].user._id).should.equal(userId);
                (cameras[0].title).should.match('Camera Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an camera if not logged in', function (done) {
    agent.post('/api/cameras')
      .send(camera)
      .expect(403)
      .end(function (cameraSaveErr, cameraSaveRes) {
        // Call the assertion callback
        done(cameraSaveErr);
      });
  });

  it('should not be able to save an camera if no title is provided', function (done) {
    // Invalidate title field
    camera.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new camera
        agent.post('/api/cameras')
          .send(camera)
          .expect(400)
          .end(function (cameraSaveErr, cameraSaveRes) {
            // Set message assertion
            (cameraSaveRes.body.message).should.match('Title cannot be blank');

            // Handle camera save error
            done(cameraSaveErr);
          });
      });
  });

  it('should be able to update an camera if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new camera
        agent.post('/api/cameras')
          .send(camera)
          .expect(200)
          .end(function (cameraSaveErr, cameraSaveRes) {
            // Handle camera save error
            if (cameraSaveErr) {
              return done(cameraSaveErr);
            }

            // Update camera title
            camera.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing camera
            agent.put('/api/cameras/' + cameraSaveRes.body._id)
              .send(camera)
              .expect(200)
              .end(function (cameraUpdateErr, cameraUpdateRes) {
                // Handle camera update error
                if (cameraUpdateErr) {
                  return done(cameraUpdateErr);
                }

                // Set assertions
                (cameraUpdateRes.body._id).should.equal(cameraSaveRes.body._id);
                (cameraUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of cameras if not signed in', function (done) {
    // Create new camera model instance
    var cameraObj = new Camera(camera);

    // Save the camera
    cameraObj.save(function () {
      // Request cameras
      request(app).get('/api/cameras')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single camera if not signed in', function (done) {
    // Create new camera model instance
    var cameraObj = new Camera(camera);

    // Save the camera
    cameraObj.save(function () {
      request(app).get('/api/cameras/' + cameraObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', camera.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single camera with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cameras/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Camera is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single camera which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent camera
    request(app).get('/api/cameras/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No camera with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an camera if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new camera
        agent.post('/api/cameras')
          .send(camera)
          .expect(200)
          .end(function (cameraSaveErr, cameraSaveRes) {
            // Handle camera save error
            if (cameraSaveErr) {
              return done(cameraSaveErr);
            }

            // Delete an existing camera
            agent.delete('/api/cameras/' + cameraSaveRes.body._id)
              .send(camera)
              .expect(200)
              .end(function (cameraDeleteErr, cameraDeleteRes) {
                // Handle camera error error
                if (cameraDeleteErr) {
                  return done(cameraDeleteErr);
                }

                // Set assertions
                (cameraDeleteRes.body._id).should.equal(cameraSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an camera if not signed in', function (done) {
    // Set camera user
    camera.user = user;

    // Create new camera model instance
    var cameraObj = new Camera(camera);

    // Save the camera
    cameraObj.save(function () {
      // Try deleting camera
      request(app).delete('/api/cameras/' + cameraObj._id)
        .expect(403)
        .end(function (cameraDeleteErr, cameraDeleteRes) {
          // Set message assertion
          (cameraDeleteRes.body.message).should.match('User is not authorized');

          // Handle camera error error
          done(cameraDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Camera.remove().exec(done);
    });
  });
});
