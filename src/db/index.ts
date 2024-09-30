import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_CONNECTION_STRING!}/acme`
    );
    console.log(
      "Mongodb Connected: Connection Host: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Mongodb Connection Error: ", error);
    process.exit(1);
  }
};

export { connectDB };
