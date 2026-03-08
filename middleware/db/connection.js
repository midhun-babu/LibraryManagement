import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    return console.log("MongoDB connected");
  } catch (err) {
    return console.error(`MongoDB connection error: ${err.message}`);
  }
};



export default connectDB;
