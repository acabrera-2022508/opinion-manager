import express from 'express';
import postRoutes from './post.routes.js';
import { loginController } from '../controller/user.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the user routes' });
});

router.post('/login', loginController);

export default router;
