import Transaction from '../models/transaction.model.js';
import errorHandler from './../helpers/dbErrorHandler.js';

const create = async (req, res) => {
  const transaction = new Transaction(req.body);
  try {
    await transaction.save();
    return res.status(200).json({
      message: 'Transaction Successfully created!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create };
