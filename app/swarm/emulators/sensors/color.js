const {
    VirtualColorSensorEmulator,
    ArenaType,
    AbstractObstacleBuilder
} = require('../../../../dist/pera-swarm');

class ColorSensorEmulator extends VirtualColorSensorEmulator {
    /**
     * ColorSensorEmulator
     * @param {Robots} robots robot object
     * @param {Function} mqttPublish mqtt publish function
     * @param {AbstractObstacleBuilder | undefined} obstacleController (optional) obstacle controller
     */
    constructor(robots, mqttPublish, obstacleController = undefined) {
        super(robots, mqttPublish);
        this._obstacleController = obstacleController;
    }

    getReading = (robot, callback) => {
        const { x, y, heading } = robot.getCoordinates();
        const reality = robot.reality;

        console.log('color measure from ', { x, y, heading });

        // TODO: @NuwanJ implement MR based filtering
        const hexColor = this._obstacleController.getColor(heading, x, y);
        // console.log(hexColor);

        let obstacleColor = this.colorToRGB(hexColor);
        const color_clear = Math.round(
            (obstacleColor.R + obstacleColor.G + obstacleColor.B) / 3
        );

        this.publish(
            `sensor/color/${robot.id}`,
            `${obstacleColor.R} ${obstacleColor.G} ${obstacleColor.B} ${color_clear}`
        );

        this.setData(robot, obstacleColor);
        robot.updateHeartbeat();

        if (callback != undefined) callback(obstacleColor);
    };

    setData = (robot, value) => {
        if (robot === undefined) throw new TypeError('robot unspecified');
        if (value === undefined) throw new TypeError('value unspecified');
        return robot.setData('color', value);
    };

    defaultSubscriptions = () => {
        return [
            {
                topic: 'sensor/color',
                type: 'JSON',
                allowRetained: false,
                subscribe: true,
                publish: false,
                handler: (msg) => {
                    // Listen for the virtual color sensor reading requests
                    console.log('MQTT.Sensor: sensor/color', msg);

                    let robot = this._robots.findRobotById(msg.id);

                    if (robot != -1) {
                        this.getReading(robot, (color) => {
                            console.log('MQTT:Sensor:ColorEmulator', color);
                        });
                    } else {
                        console.log('MQTT_Sensor:ColorEmulator', 'Robot not found');
                    }
                }
            }
        ];
    };
}

module.exports = { ColorSensorEmulator };
