import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/GetCompositeSchedule');
const responseSchema = require('../../ocpp-1.6-schemas/GetCompositeScheduleResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';

export const CHARGING_RATE_UNIT_A = 'A';
export const CHARGING_RATE_UNIT_W = 'W';

export class GetCompositeSchedule extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
