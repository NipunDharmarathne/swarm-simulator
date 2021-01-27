const { AbstractAgentEmulator } = require('../../../dist/pera-swarm');

class NeoPixelAgent extends AbstractAgentEmulator {
    constructor(mqttPublish) {
        super(null, null, mqttPublish);
    }

    update = (robot, R, G, B) => {
        const id = robot.id;
        const msg = `${R} ${G} ${B}`;

        // Store in robot data structure
        robot.setData('neopixel', { R, G, B });

        // Info the robot visualizer about update, OPTIONAL
        this.publish(`output/neopixel/${id}`, msg);
    };

    defaultSubscriptions = () => {
        return [
            {
                topic: 'output/neopixel',
                type: 'JSON',
                allowRetained: false,
                subscribe: true,
                publish: false,
                handler: (msg) => {
                    // Robots can info the server about neopixel strip through this topic
                    // console.log('MQTT.Neopixel: output/neopixel', msg);

                    const { id, R, G, B } = msg;
                    const robot = swarm.robots.findRobotById(id);

                    this.update(robot, R, G, B);
                }
            }
        ];
    };
}

module.exports = { NeoPixelAgent };
