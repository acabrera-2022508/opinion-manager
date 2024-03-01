import express from 'express';
import User from '../models/user.model.js';
import { loginController } from '../controller/user.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/mycomments', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'comments',
      select: '-__v -_id',
      populate: {
        path: 'author',
        select: '-_id name lastName username',
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', loginController);


export default router;
