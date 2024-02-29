import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connection from './database/mongo.js';
import 'dotenv/config.js'

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes

// Start server
connection().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
  });
});