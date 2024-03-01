import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connection from './database/mongo.js';
import userRoutes from './routes/user.routes.js';
import 'dotenv/config'

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes
app.use('/user', userRoutes);

// Start server
connection().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
  });
});