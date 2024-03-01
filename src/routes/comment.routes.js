import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

const router = express.Router();

router.post('/:idPost', isLoggedIn, async (req, res) => {
  try {
    const { idPost } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await Post.findById(idPost);

    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      author: user._id,
      content,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    user.comments.push(newComment._id);
    await user.save();

    return res.json(post);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
