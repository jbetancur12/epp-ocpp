import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/UnlockConnector');
const responseSchema = require('../../ocpp-1.6-schemas/UnlockConnectorResponse');

export const STATUS_UNLOCKED = 'Unlocked';
export const STATUS_UNLOCKFAILED = 'UnlockFailed';
export const STATUS_NOTSUPPORTED = 'NotSupported';

export class UnlockConnector extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
