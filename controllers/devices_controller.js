// Generated by CoffeeScript 1.9.2
var Device, express, fs, resin, router;

express = require('express');

router = express.Router();

resin = require('resin-sdk');

fs = require('fs');

Device = require('../models/device');

resin.auth.loginWithToken(JSON.parse(fs.readFileSync('token.json', {
  encoding: 'utf-8'
})).token, function(err) {
  if (err != null) {
    throw err;
  }
  return console.log('Authenticated with Resin');
});

router.post('/devices', function(req, res) {
  var device;
  device = new Device(req.body);
  return device.save(function(err) {
    if (err) {
      return res.status(422).send({
        error: err
      });
    } else {
      return res.status(201).send(device);
    }
  });
});

router.get('/devices', function(req, res) {
  return Device.find({}, function(err, devices) {
    if (err) {
      console.log(err);
      return res.status(500).send({
        error: err
      });
    } else {
      return res.send(devices);
    }
  });
});

router.get('/devices/:id', function(req, res) {
  return Device.find({
    _id: req.params.id
  }, function(err, device) {
    if (err) {
      console.log(err);
      res.status(404).send({
        error: "Not found"
      });
    }
    return resin.models.device.get(device[0].resinId, function(err, resinDevice) {
      if (err != null) {
        console.log(err);
      }
      device = device[0];
      return res.send({
        device: device,
        resinDevice: resinDevice
      });
    });
  });
});

module.exports = router;