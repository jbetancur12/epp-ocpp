import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/CancelReservation');
const responseSchema = require('../../ocpp-1.6-schemas/CancelReservationResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_REJECTED = 'Rejected';

export class CancelReservation extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
