import { Authorize } from './Authorize.js';
import { BootNotification } from './BootNotification.js';
import { CancelReservation } from './CancelReservation.js';
import { ChangeAvailability } from './ChangeAvailability.js';
import { ChangeConfiguration } from './ChangeConfiguration.js';
import { ClearCache } from './ClearCache.js';
import { ClearChargingProfile } from './ClearChargingProfile.js';
import { DataTransfer } from './DataTransfer.js';
import { DiagnosticsStatusNotification } from './DiagnosticsStatusNotification.js';
import { FirmwareStatusNotification } from './FirmwareStatusNotification.js';
import { GetCompositeSchedule } from './GetCompositeSchedule.js';
import { GetConfiguration } from './GetConfiguration.js';
import { GetDiagnostics } from './GetDiagnostics.js';
import { GetLocalListVersion } from './GetLocalListVersion.js';
import { Heartbeat } from './Heartbeat.js';
import { MeterValues } from './MeterValues.js';
import { RemoteStartTransaction } from './RemoteStartTransaction.js';
import { RemoteStopTransaction } from './RemoteStopTransaction.js';
import { ReserveNow } from './ReserveNow.js';
import { Reset } from './Reset.js';
import { SendLocalList } from './SendLocalList.js';
import { SetChargingProfile } from './SetChargingProfile.js';
import { StartTransaction } from './StartTransaction.js';
import { StatusNotification } from './StatusNotification.js';
import { StopTransaction } from './StopTransaction.js';
import { TriggerMessage } from './TriggerMessage.js';
import { UnlockConnector } from './UnlockConnector.js';
import { UpdateFirmware } from './UpdateFirmware.js';

export default {
  Authorize,
  BootNotification,
  CancelReservation,
  ChangeAvailability,
  ChangeConfiguration,
  ClearCache,
  ClearChargingProfile,
  DataTransfer,
  DiagnosticsStatusNotification,
  FirmwareStatusNotification,
  GetCompositeSchedule,
  GetConfiguration,
  GetDiagnostics,
  GetLocalListVersion,
  Heartbeat,
  MeterValues,
  RemoteStartTransaction,
  RemoteStopTransaction,
  ReserveNow,
  Reset,
  SendLocalList,
  SetChargingProfile,
  StartTransaction,
  StatusNotification,
  StopTransaction,
  TriggerMessage,
  UnlockConnector,
  UpdateFirmware,
};

export const CHARGE_POINT_COMMANDS = {
  Authorize,
  BootNotification,
  DataTransfer,
  DiagnosticsStatusNotification,
  FirmwareStatusNotification,
  Heartbeat,
  MeterValues,
  StartTransaction,
  StatusNotification,
  StopTransaction,
};

export const CENTRAL_SYSTEM_COMMANDS = {
  CancelReservation,
  ChangeAvailability,
  ChangeConfiguration,
  ClearCache,
  ClearChargingProfile,
  DataTransfer,
  GetCompositeSchedule,
  GetConfiguration,
  GetDiagnostics,
  GetLocalListVersion,
  RemoteStartTransaction,
  RemoteStopTransaction,
  ReserveNow,
  Reset,
  SendLocalList,
  SetChargingProfile,
  TriggerMessage,
  UnlockConnector,
  UpdateFirmware,
};
