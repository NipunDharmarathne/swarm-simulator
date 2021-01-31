import { Route } from '../../../../mqtt-router';
import { CoordinateValueInt } from '../../coordinate';
import { Robots } from '../../robots';
import { Communication } from './index';

export class SimpleCommunication extends Communication {
    constructor(robots: Robots, mqttPublish: Function, maxDistance = 100, debug = false) {
        super(robots, mqttPublish, maxDistance, debug);
        if (this._debug) {
            console.log('SimpleCommunication:Debug:', this._debug);
        }
    }

    /**
     * broadcast method
     * @param robotId {TId} robot id
     * @param message {string} message
     * @param callback {Function} callback function
     */
    broadcast = (robotId: number, message: string, callback: Function) => {
        if (robotId === undefined) console.error('robotId unspecified');
        if (message === undefined) console.error('message unspecified');

        const allCoordinates = this._robots.getCoordinatesAll();
        const thisCoordinate = this._robots.getCoordinatesById(robotId);
        let receivers = 0;
        let receiveList: number[] = [];

        allCoordinates.forEach(
            (coordinate: CoordinateValueInt<number>, index?: number) => {
                if (thisCoordinate !== -1 && coordinate.id !== thisCoordinate.id) {
                    const withinRange = this.distanceCheck(
                        this._getDistance(thisCoordinate, coordinate)
                    );
                    if (withinRange) {
                        // within the distance range, so send the messaage
                        receivers++;
                        receiveList.push(coordinate.id);
                        //if (this._debug) console.log(`robot #${coordinate.id}: pass`);
                        //this._mqttPublish(`/comm/in/${coordinate.id}`, message);
                    }
                }
            }
        );

        console.log(`robot ${robotId} sending to`, receiveList);
        receiveList.forEach((id) => {
            //console.log('sending to', id);
            this._mqttPublish(`/comm/in/${id}`, message);
        });

        if (callback != undefined) callback({ receivers: receivers });
    };

    /*
     * method contains the default subscription topics of the module.
     * this will be handled by mqtt-router
     */
    defaultSubscriptions = (): Route[] => {
        return [];
    };
}