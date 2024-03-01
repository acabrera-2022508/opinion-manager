import express from 'express';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
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

router.put('/:idComment', isLoggedIn, async (req, res) => {
  try {
    const { idComment } = req.params;
    const { content } = req.body;
    const user = req.user;

    const comment = await Comment.findById(idComment);

    if (!comment) {
      return res.status(400).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You are not the author of this comment' });
    }

    comment.content = content;
    await comment.save();

    return res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:idComment', isLoggedIn, async (req, res) => {
  try {
    const { idComment } = req.params;
    const user = req.user;

    const comment = await Comment.findById(idComment);

    if (!comment) {
      return res.status(400).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You are not the author of this comment' });
    }

    // Remove comment from user
    user.comments = user.comments.filter(
      (comment) => comment.toString() !== idComment
    );
    await user.save();

    // Remove comment from post
    const post = await Post.findOne({ comments: idComment });
    post.comments = post.comments.filter(
      (comment) => comment.toString() !== idComment
    );
    await post.save();

    // Remove comment
    await Comment.findByIdAndDelete(idComment);

    return res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
