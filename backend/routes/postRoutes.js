import express from 'express';
import { createPost, getAllPosts,likePost,dislikePost,getPostsByUserId } from '../controllers/postController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Create post with image upload
router.post('/', verifyAccessToken, upload.single('image'), createPost);

// Get all posts
router.get('/', verifyAccessToken, getAllPosts);
router.post('/:postId/like', verifyAccessToken, likePost);
router.post('/:postId/dislike', verifyAccessToken, dislikePost);
router.get('/user/:userId', getPostsByUserId);

export default router;
