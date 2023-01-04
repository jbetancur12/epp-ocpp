import BaseCommand from './BaseCommand.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const requestSchema = require('../../ocpp-1.6-schemas/FirmwareStatusNotification');
const responseSchema = require('../../ocpp-1.6-schemas/FirmwareStatusNotificationResponse');

export const STATUS_DOWNLOADED = 'Downloaded';
export const STATUS_DOWNLOADFAILED = 'DownloadFailed';
export const STATUS_DOWNLOADING = 'Downloading';
export const STATUS_IDLE = 'Idle';
export const STATUS_INSTALLATIONFAILED = 'InstallationFailed';
export const STATUS_INSTALLING = 'Installing';
export const STATUS_INSTALLED = 'Installed';

export class FirmwareStatusNotification extends BaseCommand {
  constructor(values) {
    super(requestSchema, responseSchema, values);
  }
}
