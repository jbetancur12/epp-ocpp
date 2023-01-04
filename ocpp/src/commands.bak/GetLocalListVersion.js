import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/GetLocalListVersion');
const responseSchema = require('../../ocpp-1.6-schemas/GetLocalListVersionResponse');

export class GetLocalListVersion extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
