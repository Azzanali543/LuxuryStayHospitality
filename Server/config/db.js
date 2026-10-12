const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB Connection Error: MONGO_URI is missing from Server/.env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Make sure MongoDB is running and MONGO_URI in Server/.env is correct.");
    throw error;
  }
};

module.exports = connectDB;
