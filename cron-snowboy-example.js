const Milight = require('node-milight-promise');
const schedule = require('node-schedule');
const commands = Milight.commandsV6;
const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;
const models = new Models();
models.add({
  file: 'resources/Aura.pmdl',
  sensitivity: '0.5',
  hotwords: 'aura'
});
const detector = new Detector({
  resource: "resources/common.res",
  models: models,
  audioGain: 2.0
});
const light = new Milight.MilightController({
  ip: "192.168.0.10",
  type: 'v6'
});

var mic = {};
const job = schedule.scheduleJob({hour: 22, minute: 0}, function() {
  mic = record.start({
    threshold: 0,
    verbose: true
  });
  mic.pipe(detector);
  light.sendCommands(commands.bridge.on(), commands.bridge.hue(255), commands.bridge.brightness(100));
});

//Event of the detector
detector.on('silence', function() {
  console.log('silence');
});

detector.on('error', function() {
  console.log('error');
});

detector.on('hotword', function(index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
  console.log('hotword', index, hotword);
  mic.unpipe(detector);
  record.stop();
  light.sendCommands(commands.bridge.hue(115), commands.bridge.brightness(100));
  light.pause(2500);
  light.sendCommands(commands.bridge.off());
  console.log('bridge turned off with success');
});
