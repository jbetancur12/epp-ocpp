import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/ChangeAvailability');
const responseSchema = require('../../ocpp-1.6-schemas/ChangeAvailabilityResponse');

export const TYPE_INOPERATIVE = 'Inoperative';
export const TYPE_OPERATIVE = 'Operative';

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';
export const STATUS_SCHEDULED = 'Scheduled';

export class ChangeAvailability extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
