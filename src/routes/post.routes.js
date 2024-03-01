import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import Category from '../models/category.model.js';

const router = express.Router();

router.get('/all', isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({})
      .select('-__v')
      .populate({
        path: 'author',
        select: '-_id name lastName username',
      })
      .populate({
        path: 'category',
        select: '-_id name',
      })
      .populate({
        path: 'comments',
        select: '-__v -_id',
        populate: {
          path: 'author',
          select: '-_id name lastName username',
        },
      });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/create', isLoggedIn, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const user = req.user;

    const categoryFound = await Category.findOne({ name: category });

    if (!categoryFound) {
      return res.status(400).json({
        message: 'Category not found',
        categoriesAvailable: await Category.find({}).select('-_id name'),
      });
    }

    const newPost = new Post({
      author: user._id,
      category: categoryFound._id,
      title,
      content,
      comments: [],
    });

    await newPost.save();

    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({ message: 'Post created', newPost });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/update/:id', isLoggedIn, async (req, res) => {
  try {
    let { title, content, category } = req.body;
    const user = req.user;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized is not your post' });
    }

    if (!title && !content && !category) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const categoryFound = await Category.findOne({ name: category });

    if (!categoryFound) {
      return res.status(400).json({
        message: 'Category not found',
        categoriesAvailable: await Category.find({}).select('-_id name'),
      });
    }

    title = title || post.title;
    content = content || post.content;

    await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        category: categoryFound._id,
      },
      { new: true }
    );

    res.json({ message: 'Post updated' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized is not your post' });
    }

    // delete comments of all users
    const comments = await Comment.find({ _id: { $in: post.comments } });

    for (const comment of comments) {
      await Comment.findByIdAndDelete(comment._id);

      const userComment = await User.findById(comment.author);
      userComment.comments = userComment.comments.filter(
        (comment) => comment.toString() !== comment._id.toString()
      );

      await userComment.save();
    }

    await Post.findByIdAndDelete(postId);

    // delete post from user
    user.posts.forEach(async (post, index) => {
      if (post.toString() === postId) {
        user.posts.splice(index, 1);
        await user.save();
      }
    });

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
