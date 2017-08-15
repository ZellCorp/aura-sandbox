var Milight = require('node-milight-promise');
var schedule = require('node-schedule');
var commands = Milight.commandsV6;
// Important Notes:
// *  Instead of providing the global broadcast address which is the default, you should provide the IP address
//    of the Milight Controller for unicast mode. Don't use the global broadcast address on Windows as this may give
//    unexpected results. On Windows, global broadcast packets will only be routed via the first network adapter. If
//    you want to use a broadcast address though, use a network-specific address, e.g. for `192.168.0.1/24` use
//    `192.168.0.255`.
var light = new Milight.MilightController({
    ip: "192.168.0.10",
    type: 'v6'
  });
light.sendCommands(commands.bridge.off());
var job = schedule.scheduleJob('*/1 * * * *', function(){
  var light = new Milight.MilightController({
      ip: "192.168.0.10",
      type: 'v6'
    });
  light.ready().then(function() {
    // Switch On, White Mode, Brightness 100%
    light.sendCommands(commands.bridge.on(), commands.bridge.whiteMode(), commands.bridge.brightness(100));
    light.pause(1000);

    // Switch Off
    light.sendCommands(commands.bridge.off());
    light.pause(1000);

    light.close().then(function () {
      console.log("All command have been executed - closing Milight");
    });
    console.log("Invocation of asynchronous Milight commands done");
  }).catch(function(error) {
    console.log(error);
  });
});
