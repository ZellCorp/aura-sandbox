const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;
const fs = require('fs');
const models = new Models();
const file = fs.createWriteStream('aura.raw', { encoding: 'binary' });
var listening = false;
models.add({
  file: 'resources/Aura.pmdl',
  sensitivity: '0.5',
  hotwords : 'aura'
});

const detector = new Detector({
  resource: "resources/common.res",
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  console.log('silence');
  if(listening){
      mic.unpipe(file);
      listening = fase;
  }
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function (index, hotword, buffer) { // Buffer arguments contains sound that triggered the event, for example, it could be written to a wav stream
  console.log('hotword', index, hotword);
  listening = true;
  mic.pipe(file);
});

detector.on('data', function(data){
  console.log('caca');
});

const mic = record.start({
  threshold: 0,
  verbose: true
});

mic.pipe(detector);
