import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/ChangeConfiguration');
const responseSchema = require('../../ocpp-1.6-schemas/ChangeConfigurationResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';
export const STATUS_REBOOTREQUIRED = 'RebootRequired';
export const STATUS_NOTSUPPORTED = 'NotSupported';

export class ChangeConfiguration extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
