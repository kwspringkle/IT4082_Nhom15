import express from 'express';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  lockAccount,
  unlockAccount, 
  getCurrentUser,
  updateCurrentUser,
  changePassword,
} from '../controller/account.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);
router.patch('/:id/lock', lockAccount);
router.patch('/:id/unlock', unlockAccount);
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateCurrentUser);
router.patch('/me/password', authenticate, changePassword);

export default router;
