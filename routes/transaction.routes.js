import express from 'express';
import userCtrl from '../controllers/user.controller.js';
import authCtrl from '../controllers/auth.controller.js';
import transactionCtrl from '../controllers/transaction.controller.js';

const router = express.Router();

router
  .route('/api/posts/new/:userId')
  .post(authCtrl.requireSignin, transactionCtrl.create);

router.param('userId', userCtrl.userByID);

export default router;
