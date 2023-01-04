import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  charger_box_id: {
    type: String,
    required: true,
  },
  connector: {
    type: Number,
    required: true,
  },
  start_timestamp: {
    type: Date,
    required: true,
  },
  start_value: {
    type: Number,
    required: true,
  },
  stop_timestamp: {
    type: Date,
    required: true,
  },
  stop_value: {
    type: Number,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model('Transaction', TransactionSchema);
