import {
  ERRORCODE_NOERROR,
  STATUS_AVAILABLE,
} from './commands/StatusNotification.js';

export default class Connector {
  constructor(connectorId) {
    this.connectorId = connectorId;
    this.status = STATUS_AVAILABLE;
    this.errorCode = ERRORCODE_NOERROR;
  }
}
