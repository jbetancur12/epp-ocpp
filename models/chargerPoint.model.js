import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChargerPointSchema = new Schema({
  charger_box_id: {
    type: String,
    required: true,
  },
  ocpp_protocol: {
    type: String,
    required: false,
  },
  registration_status: {
    type: String,
    required: false,
  },
  charge_point_vendor: {
    type: String,
    required: false,
  },
  charger_point_model: {
    type: String,
    required: false,
  },
  charger_point_serial_number: {
    type: String,
    required: false,
  },
  charger_box_serial_number: {
    type: String,
    required: false,
  },
  fw_version: {
    type: String,
    required: false,
  },
  fw_update_status: {
    type: String,
    required: false,
  },
  fw_update_timestamp: {
    type: Date,
    required: false,
  },
  meter_type: {
    type: String,
    required: false,
  },
  meter_serial_number: {
    type: String,
    required: false,
  },
  diagnostics_status: {
    type: String,
    required: false,
  },
  diagnostics_timestamp: {
    type: Date,
    required: false,
  },
  last_heartbeat_timestamp: {
    type: Date,
    required: false,
  },
  iccid: {
    type: String,
    required: false,
  },
  imsi: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model('ChargerPoint', ChargerPointSchema);
