import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;
