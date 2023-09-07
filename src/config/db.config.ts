import mongoose from "mongoose";

/**Connect to MongoDB */
const connectDB = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  }
  catch (err: any) {
    console.error(`Error: ${err.message}`);
  }
}

export default connectDB;