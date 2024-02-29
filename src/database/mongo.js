import mongoose from 'mongoose';
import 'dotenv/config';

export default async function connection() {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {});
    console.log('Database connected!');
  } catch (error) {
    console.log('Error connecting to database: ', error);
  }
}
