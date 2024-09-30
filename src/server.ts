import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./db";

// set port
const port = process.env.PORT || 8000;

// start the server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("(Server.js) Error: ", error);
  });
