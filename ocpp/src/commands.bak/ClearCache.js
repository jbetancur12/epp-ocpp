import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/ClearCache');
const responseSchema = require('../../ocpp-1.6-schemas/ClearCacheResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';

export class ClearCache extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
