import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:postId', verifyAccessToken, addComment);
router.get('/:postId', verifyAccessToken,getComments);

export default router;
