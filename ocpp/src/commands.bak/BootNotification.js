import BaseCommand from './BaseCommand.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/BootNotification');
const responseSchema = require('../../ocpp-1.6-schemas/BootNotificationResponse');

export const STATUS_ACCEPTED = 'Accepted';
export const STATUS_PENDING = 'Pending';
export const STATUS_REJECTED = 'Rejected';

export class BootNotification extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
