import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import {
  allController,
  createController,
  updateController,
  deleteController,
} from '../controller/post.controller.js';

const router = express.Router();

router.get('/all', isLoggedIn, allController);
router.post('/create', isLoggedIn, createController);
router.put('/update/:id', isLoggedIn, updateController);
router.delete('/delete/:id', isLoggedIn, deleteController);

export default router;
