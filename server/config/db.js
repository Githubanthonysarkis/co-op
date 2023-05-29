const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to database using the connection string in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(err);
    // If database failed to connect, exit the application
    process.exit(1);
  }
};

module.exports = connectDB;
