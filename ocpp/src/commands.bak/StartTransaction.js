import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/StartTransaction');
const responseSchema = require('../../ocpp-1.6-schemas/StartTransactionResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_BLOCKED = 'Blocked';
export const STATUS_EXPIRED = 'Expired';
export const STATUS_INVALID = 'Invalid';
export const STATUS_CONCURRENTTX = 'ConcurrentTx';

export class StartTransaction extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
