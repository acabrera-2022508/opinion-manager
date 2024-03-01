import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/user.model.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token or expired' });
  }
};