import { ChargePoint, Connector, OCPPCommands } from './ocpp/src/index.js';
import * as BootNotificationConst from "./ocpp/src/commands/BootNotification.js";
import * as StatusNotificationConst from "./ocpp/src/commands/StatusNotification.js";
import * as RemoteStartTransactionConst from "./ocpp/src/commands/RemoteStartTransaction.js";

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
process.on('unhandledRejection', function (reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

export default async function run() {
  const connector1 = new Connector(1);
  const connector2 = new Connector(2);

  const client = new ChargePoint({
    centralSystemUrl: `ws://localhost:3000/webServices/ocpp/CP${Math.floor(Math.random() * 9999)}`,
    // centralSystemUrl: `https://ocpp-example.herokuapp.com/webServices/ocpp/CP${Math.floor(Math.random() * 9999)}`,
    connectors: [
      connector1,
      connector2
    ]
  });

  try {
    await client.connect();

    client.onRequest = async (command) => {
      switch (true) {
        case command instanceof OCPPCommands.RemoteStartTransaction:
          setTimeout(() => startTransaction(command), 1);
          return {
            status: RemoteStartTransactionConst.STATUS_ACCEPTED
          };
        case command instanceof OCPPCommands.RemoteStopTransaction:
          setTimeout(() => stopTransaction(command), 1);
          return {
            status: RemoteStartTransactionConst.STATUS_ACCEPTED
          };
      }
    };

    const boot = new OCPPCommands.BootNotification({
      chargePointVendor: 'BrandX',
      chargeBoxSerialNumber: 'SR' + Math.round(Math.random() * 100000),
      chargePointSerialNumber: '123',
      chargePointModel: '12'
    });

    let answer = await client.send(boot);

    await client.sendCurrentStatus();
  } catch (err) {
    console.error('--- Err', err);
  }

  async function startTransaction({ connectorId }) {
    const idTag = 'test';
    const authCommand = new OCPPCommands.Authorize({
      idTag
    });

    await client.send(authCommand);

    const statusCommand = new OCPPCommands.StatusNotification({
      connectorId,
      errorCode: StatusNotificationConst.ERRORCODE_NOERROR,
      status: StatusNotificationConst.STATUS_CHARGING
    });

    await client.send(statusCommand);

    const startCommand = new OCPPCommands.StartTransaction({
      connectorId,
      idTag,
      meterStart: 0,
      timestamp: new Date().toISOString(),
    });

    await client.send(startCommand);
  }

  async function stopTransaction({ transactionId }) {
    const statusCommand = new OCPPCommands.StatusNotification({
      connectorId: transactionId,
      errorCode: StatusNotificationConst.ERRORCODE_NOERROR,
      status: StatusNotificationConst.STATUS_AVAILABLE
    });

    await client.send(statusCommand);

    const startCommand = new OCPPCommands.StopTransaction({
      transactionId,
      meterStop: 1,
      timestamp: new Date().toISOString(),
    });

    await client.send(startCommand);
  }
}


