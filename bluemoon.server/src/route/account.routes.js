import express from 'express';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  lockAccount,
  unlockAccount
} from '../controller/account.controller.js';

const router = express.Router();

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);
router.patch('/:id/lock', lockAccount);
router.patch('/:id/unlock', unlockAccount);

export default router;
