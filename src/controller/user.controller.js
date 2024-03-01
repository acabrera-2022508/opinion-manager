import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { createToken } from '../helpers/jwt.js';
import User from '../models/user.model.js';

export const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username && email) {
      return res
        .status(400)
        .json({ message: 'Only one of username or email is required' });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user && comparePassword(password, user.password)) {
      const loggedUser = {
        uid: user._id,
        username: user.username,
        email: user.email,
      };

      const token = await createToken(loggedUser);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: loggedUser,
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
