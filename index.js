const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet"); //extra layer security
const morgan = require("morgan"); //middleware
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("mongo connected");
});
// middleware
app.use(express.json()); //body-parser
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute); //userroute root patch
app.use("/api/auth", authRoute); //authroute root patch
app.use("/api/posts", postRoute); //postroute root patch

app.listen(5000, () => {
  console.log("Backend server is running...");
});
