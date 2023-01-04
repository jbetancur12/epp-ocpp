import { CentralSystem, OCPPCommands } from './ocpp/src/index.js';
import * as AuthorizeConst from './ocpp/src/commands/Authorize.js';
import * as StartTransactionConst from './ocpp/src/commands/StartTransaction.js';
import OCPPError, { ERROR_NOTIMPLEMENTED } from './ocpp/src/ocppError.js';
import * as BootNotificationConst from './ocpp/src/commands/BootNotification.js';
import * as StatusNotificationConst from './ocpp/src/commands/StatusNotification.js';

import ChargerPoint from './models/chargerPoint.model.js';
import Transaction from './models/transaction.model.js';
import authCtrl from './controllers/user.controller.js';

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

const concatenate = (command, client) => {
  const ui = Math.round(Date.now() + Math.random());
  const connectorIdx = client.info.connectors.findIndex((item) => {
    return command.connectorId === item.connectorId;
  });

  const uid = '' + ui + client.info.connectors[connectorIdx].connectorId;
  if (connectorIdx === -1) {
    client.info.connectors.push({});
  } else {
    client.info.connectors[connectorIdx] = {
      ...client.info.connectors[connectorIdx],
      ...{ transactionId: uid },
    };
    return uid;
  }
};

export function createServer(server) {
  const cSystem = new CentralSystem({
    validateConnection,
    wsOptions: { server },
  });

  cSystem.listen(null);

  cSystem.onStatusUpdate = async function () {};

  cSystem.onRequest = async function (client, command) {
    const connection = client.connection;

    console.info(`New command from ${connection.url}`);
    switch (true) {
      case command instanceof OCPPCommands.BootNotification:
        client.info = {
          connectors: [],
          ...command,
        };

        let chargerPoint = await ChargerPoint.findOne({
          charger_box_id: connection.url.substring(1),
        });

        if (!chargerPoint) {
          console.info('ChargerPoint does not exist in DB');
          return {
            status: BootNotificationConst.STATUS_REJECTED,
            currentTime: new Date().toISOString(),
            interval: 30,
          };
        }

        await ChargerPoint.findByIdAndUpdate(
          chargerPoint._id,
          getCPData(command),
        );
        return {
          status: BootNotificationConst.STATUS_ACCEPTED,
          currentTime: new Date().toISOString(),
          interval: 100,
        };

      case command instanceof OCPPCommands.Authorize:
        return {
          idTagInfo: {
            status: AuthorizeConst.STATUS_ACCEPTED,
          },
        };

      case command instanceof OCPPCommands.MeterValues:
        const connectorIdx = client.info.connectors.findIndex((item) => {
          return command.connectorId === item.connectorId;
        });
        if (connectorIdx === -1) {
          client.info.connectors.push({});
        } else {
          client.info.connectors[connectorIdx] = {
            ...client.info.connectors[connectorIdx],
            ...command.meterValue[0].sampledValue[0],
          };
        }
        await cSystem.onStatusUpdate();
        return {};

      case command instanceof OCPPCommands.StartTransaction:
        // const uid = concatenate(command, client);

        //  await cSystem.onStatusUpdate();

        return {
          transactionId: 1,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED,
          },
        };

      case command instanceof OCPPCommands.StopTransaction:
        return {
          transactionId: 1,
          idTagInfo: {
            status: StartTransactionConst.STATUS_ACCEPTED,
          },
        };

      case command instanceof OCPPCommands.Heartbeat:
        return {
          currentTime: new Date().toISOString(),
        };

      case command instanceof OCPPCommands.StatusNotification:
        // client.info = client.info || {};
        // client.info.connectors = client.info.connectors || [];

        const connectorIndex = client.info.connectors.findIndex((item) => {
          return command.connectorId === item.connectorId;
        });

        if (connectorIndex === -1) {
          client.info.connectors.push({
            ...command,
          });
        } else {
          client.info.connectors[connectorIndex] = {
            ...command,
          };
        }
        await cSystem.onStatusUpdate();
        return {};
      default:
        throw new OCPPError(ERROR_NOTIMPLEMENTED, 'Unknown command');
    }
  };

  cSystem.toggleChargePoint = async (
    client,
    connectorId,
    user,
    transactionId,
  ) => {
    const connector = client.info.connectors.find(
      (item) => connectorId.toString() === item.connectorId.toString(),
    );
    if (!connector) {
      return null;
    }

    if (connector.status !== StatusNotificationConst.STATUS_AVAILABLE) {
      let command = new OCPPCommands.RemoteStopTransaction({
        transactionId: connectorId,
      });
      await client.connection.send(command);
      return;
    }

    let command = new OCPPCommands.RemoteStartTransaction({
      connectorId: connectorId,
      idTag: '' + user,
    });

    await client.connection.send(command);
  };
  return cSystem;

  async function validateConnection(url) {
    let chargerPoint = await ChargerPoint.findOne({
      charger_box_id: url.substring(1),
    });

    if (chargerPoint) {
      return true;
    }
    return false;
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
