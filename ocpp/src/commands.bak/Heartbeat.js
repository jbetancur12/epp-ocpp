import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/Heartbeat');
const responseSchema = require('../../ocpp-1.6-schemas/HeartbeatResponse');

export class Heartbeat extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
