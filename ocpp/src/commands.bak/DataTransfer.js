import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/DataTransfer');
const responseSchema = require('../../ocpp-1.6-schemas/DataTransferResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';
export const STATUS_UNKNOWNMESSAGEID = 'UnknownMessageId';
export const STATUS_UNKNOWNVENDORID = 'UnknownVendorId';

export class DataTransfer extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
