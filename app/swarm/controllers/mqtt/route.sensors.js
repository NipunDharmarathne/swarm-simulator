// sensor routes and handlers
// Note: 'swarm' argument will be added via wrapper

const routes = [
    {
        topic: 'v1/sensor/distance',
        allowRetained: true,
        handler: (msg, swarm) => {
            console.log('MQTT_Sensor:Distance_Handler: ', msg);

            var robot = swarm.robots.findRobotById(msg.id);

            if (robot != undefined) {
                var returnValue = robot.sensors.distance.syncReading(msg.distance);
                swarm.publish('v1/sensor/distance/' + robot.id, returnValue);
            } else {
                // No robot found. Just echo the message, because this is a blocking call for the robot
                // TODO: register the robot into system
                swarm.publish('v1/sensor/distance/' + msg.id, msg.distance);
            }
        },
        subscribe: true
    }
];

module.exports = routes;