import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/DiagnosticsStatusNotification');
const responseSchema = require('../../ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse');

export const STATUS_IDLE = 'Idle';
export const STATUS_UPLOADED = 'Uploaded';
export const STATUS_UPLOADFAILED = 'UploadFailed';
export const STATUS_UPLOADING = 'Uploading';

export class DiagnosticsStatusNotification extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
