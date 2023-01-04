import ChargerPoint from '../models/chargerPoint.model.js';
import extend from 'lodash/extend.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import { centralSystem } from '../server.js';
import _ from 'lodash';

const create = async (req, res) => {
  const chargerPoint = new ChargerPoint(req.body);
  try {
    await chargerPoint.save();
    return res.status(200).json({
      message: 'Charger Point Successfully created!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    let chargerPoints = await ChargerPoint.find();
    res.json(chargerPoints);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const chargerPointByID = async (req, res, next, id) => {
  try {
    let chargerPoint = await ChargerPoint.findById(id);
    console.log(chargerPoint);
    if (!chargerPoint)
      return res.status('400').json({
        error: 'ChargerPoint not found',
      });
    req.cp = chargerPoint;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve chargerPoint',
    });
  }
};

const read = async (req, res) => {
  // console.log(req)
  try {
    let chargerPoint = await ChargerPoint.findOne({
      charger_box_id: req.params.station,
    });
    if (!chargerPoint)
      return res.status('400').json({
        error: 'ChargerPoint not found',
      });
    res.json(chargerPoint);
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve chargerPoint',
    });
  }
};

const update = async (req, res) => {
  try {
    let chargerPoint = req.cp;
    chargerPoint = extend(chargerPoint, req.body);
    chargerPoint.updated = Date.now();
    await chargerPoint.save();
    res.json(chargerPoint);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remoteStart = async (req, res) => {
  const idf = _.findIndex(centralSystem.clients, function (o) {
    return o.connection.req.url === `${req.body.id}`;
  });
  if (idf !== -1) {
    await centralSystem.toggleChargePoint(
      centralSystem.clients[idf],
      parseInt(req.body.connector),
      req.profile.id_tag,
      //req.body.transactionId
    );
    res.write(JSON.stringify({}));
  }
  res.end();
  return;
};

const remove = async (req, res) => {
  try {
    let chargerPoint = req.cp;
    let deleteCP = await chargerPoint.remove();
    deleteCP.hashed_password = undefined;
    deleteCP.salt = undefined;
    res.json(deleteCP);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const clients = async (req, res) => {
  try {
    const getClients = centralSystem.clients.map(
      (client) => client.connection.req.url,
    );
    res.json(getClients);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const status = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  onDigits(req, res);
  centralSystem.onStatusUpdate = () => onDigits(req, res);
};

function onDigits(req, res) {
  const intervalId = setInterval(() => {
    const data = centralSystem.clients.map((client) => {
      return { id: client.connection.req.url, ...client.info };
    });

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  res.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
}

export default {
  create,
  chargerPointByID,
  read,
  list,
  remove,
  update,
  status,
  clients,
  remoteStart,
};
