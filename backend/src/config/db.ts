import mongoose from 'mongoose';

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error: unknown) {
    console.error(
      'MongoDB connection error:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

export default connectDB;
