import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
import User from '../models/User.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyAccessToken, async (req, res) => {
    try {
      // req.userId is set by verifyToken middleware after verifying JWT
        const user = await User.findById(req.user.id).select('-password');
       // exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
