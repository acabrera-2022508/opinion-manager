import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createToken = async (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });
  } catch (error) {
    console.log(error);
  }
};
