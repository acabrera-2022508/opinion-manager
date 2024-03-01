import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from '../controller/category.controller.js';

const router = express.Router();

router.get('/all', isLoggedIn, getAllCategories);
router.post('/create', isLoggedIn, createCategory);
router.delete('/delete/:id', isLoggedIn, deleteCategory);

export default router;
