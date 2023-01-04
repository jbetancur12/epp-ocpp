import express from 'express';
import authCtrl from '../controllers/auth.controller.js';
import userCtrl from '../controllers/user.controller.js';
import chargerPoint from '../controllers/chargerPoint.controller.js';

const router = express.Router();

router.route('/ocpp/chargerPoints/status').get(chargerPoint.status);

router.route('/ocpp/chargerPoints/clients').get(chargerPoint.clients);

router
  .route('/ocpp/chargerPoints/:station')
  .get(chargerPoint.read)
  .put(chargerPoint.update)
  .delete(chargerPoint.remove);

router
  .route('/ocpp/chargerPoints/start/:userId')
  .post(chargerPoint.remoteStart);

router
  .route('/ocpp/chargerPoints')
  .get(chargerPoint.list)
  .post(chargerPoint.create);

router.param('station', chargerPoint.chargerPointByID);
router.param('userId', userCtrl.userByID);

export default router;
