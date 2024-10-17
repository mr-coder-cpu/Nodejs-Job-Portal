import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to Mongo Db Database ${mongoose.connection.host}`.bgMagenta.white)

  }
  catch (error) {
    console.log(`MONGO DB ERROR ${error}`.bgRed.white);

  }
};

export default connectDB;

// mongodb + srv://riteshjangir:xEHsGP3vwqrSqBGY@job.mongodb.net/Job-portal?retryWrites=true&w=majority