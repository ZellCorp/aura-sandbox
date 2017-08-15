const stream = require('stream')


const Damn = {};

damn.init = (options, recognizer) => {
  const opts = Object.assign({}, options),
    damn = new stream.Writable();
  damn.mic = {};
  damn.recordProgram = opts.recordProgram;
  damn.device = opts.device;
  damn.started = false;
};

Damn.init();
