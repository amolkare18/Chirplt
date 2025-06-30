import express from 'express';
import {
  followUser,
  unfollowUser,
  searchUsers,
  getUserProfile
} from '../controllers/userController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:userId/follow', verifyAccessToken, followUser);
router.post('/:userId/unfollow', verifyAccessToken, unfollowUser);
router.get('/search', verifyAccessToken, searchUsers);
router.get('/:userId', verifyAccessToken, getUserProfile);

export default router;
