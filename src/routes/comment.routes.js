import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import {
  commentController,
  updateCommentController,
  deleteCommentController,
} from '../controller/comment.controller.js';

const router = express.Router();

router.post('/:idPost', isLoggedIn, commentController);
router.put('/:idComment', isLoggedIn, updateCommentController);
router.delete('/:idComment', isLoggedIn, deleteCommentController);

export default router;
