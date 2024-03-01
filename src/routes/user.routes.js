import express from 'express';
import {
  loginController,
  profileController,
  commentsController,
  postController,
  registerController,
  updateController,
  updatePasswordController,
} from '../controller/user.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/profile', isLoggedIn, profileController);
router.get('/comments', isLoggedIn, commentsController);
router.get('/posts', isLoggedIn, postController);
router.post('/register', registerController);
router.post('/login', loginController);
router.put('/update', isLoggedIn, updateController);
router.put('/update/password', isLoggedIn, updatePasswordController);

export default router;
