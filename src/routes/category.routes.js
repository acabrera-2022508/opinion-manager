import express from 'express';
import Category from '../models/category.model.js';
import Post from '../models/post.model.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/all', isLoggedIn, async (req, res) => {
  try {
    const categories = await Category.find({}).select('-__v');

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/create', isLoggedIn, async (req, res) => {
  try {
    const { name } = req.body;

    const categories = await Category.find({});

    const categoryExists = categories.some(
      (category) => category.name === name
    );

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
    });

    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const posts = await Post.find({ category: category._id })
      .select('-__v')
      .populate({
        path: 'category',
        select: '-_id name',
      })
      .populate({
        path: 'author',
        select: '-_id name lastName username',
      })
      .populate({
        path: 'comments',
        select: '-__v',
        populate: {
          path: 'author',
          select: '-_id name lastName username',
        },
      });

    if (posts.length > 0) {
      return res.status(400).json({
        message: 'Category has posts associated',
        posts,
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
