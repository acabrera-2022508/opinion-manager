import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connection from './database/mongo.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';
import User from './models/user.model.js';
import Category from './models/category.model.js';
import { hashPassword } from './helpers/bcrypt.js';
import 'dotenv/config';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

// Start server
connection()
  .then(async () => {
    const user = new User({
      name: 'admin',
      lastName: 'admin',
      email: 'admin@admin.com',
      username: 'admin',
      password: await hashPassword('admin'),
      posts: [],
      comments: [],
    });

    const category = new Category({
      name: 'General',
    });

    const users = await User.find({});
    const categories = await Category.find({});

    if (categories.length === 0) category.save();
    if (users.length === 0) user.save();
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  });
