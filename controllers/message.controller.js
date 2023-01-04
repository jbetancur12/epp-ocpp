import actions, { HEARTBEAT } from '../actions/chargePoint.action.js';
import ChargerPoint from '../models/chargerPoint.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import { v4 as uuidv4 } from 'uuid';

const getCPData = (payload) => {
  return {
    charge_point_vendor: payload.chargePointVendor || '',
    charge_point_model: payload.chargePointModel || '',
    charge_point_serial_number: payload.chargePointSerialNumber || '',
    charge_box_serial_number: payload.chargeBoxSerialNumber || '',
    fw_version: payload.firmwareVersion || '',
    iccid: payload.iccid || '',
    imsi: payload.imsi || '',
    meter_type: payload.meterType || '',
    meter_serial_number: payload.meterSerialNumber || '',
    registration_status: 'Accepted',
  };
};

const actionsSended = { id: '', lastAction: '', cp_id: '' };

async function messageController(ws, socket, message, url, CLIENTS) {
  const body = JSON.parse(message);
  if (body[0] === 2) {
    switch (body[2]) {
      case actions.HEARTBEAT: {
        const HBDate = new Date().toISOString();
        await ChargerPoint.findOneAndUpdate(
          { charger_box_id: url.substring(1) },
          { last_heartbeat_timestamp: HBDate },
        );

        return socket.send([3, body[1], { currentTime: HBDate }]);
      }

      case actions.AUTHORIZE:
        break;

      case actions.BOOT_NOTIFICATION:
        try {
          let chargerPoint = await ChargerPoint.findOne({
            charger_box_id: url.substring(1),
          });
          if (!chargerPoint) {
            console.log('ChargerPoint does not exist in DB');
            return socket.send(
              JSON.stringify([
                3,
                body[1],
                {
                  currentTime: new Date().toISOString(),
                  interval: 300,
                  status: 'Rejected',
                },
              ]),
            );
          }

          await ChargerPoint.findByIdAndUpdate(
            chargerPoint._id,
            getCPData(body[3]),
          );

          return socket.send(
            JSON.stringify([
              3,
              body[1],
              {
                currentTime: new Date().toISOString(),
                interval: 300,
                status: 'Accepted',
              },
            ]),
          );
        } catch (err) {
          return socket.send(
            JSON.stringify({
              error: errorHandler.getErrorMessage(err),
            }),
          );
        }

      case actions.START_TRANSACTION:
        socket.send(
          JSON.stringify([
            3,
            body[1],
            {
              idTagInfo: {
                status: 'Accepted',
              },
              transactionId: uuidv4(),
            },
          ]),
        );

      case actions.RESET:
        console.log(url);

      default:
        break;
    }
  } else if (body[0] == 3) {
    //url.substring(1)

    console.log('3=> ', CLIENTS);
  }
}

async function messageFromServerController(wss, socket, message, url) {
  console.log(JSON.parse(message));
  socket.send(message);
}

function senMessage(wss, socket, message, url) {
  return new Promise((resolve, reject) => {
    socket.send(message);
  });
}

export { messageController, messageFromServerController };
