const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const multer = require("multer");
const path = require("path");

dotenv.config();
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("CONNECTED TO MONGODB");
});
app.use("/images", express.static(path.join(__dirname, "public/images")));
//MIDDLEWARE

app.use(express.json());
//Express apps by setting various HTTP headers
app.use(helmet());
//HTTP request logger middleware for node.js
app.use(morgan("common"));

//file/image upload
const storage = multer.diskStorage({
  //where the file will be stored
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  //from where we will take file
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
//Routers
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(5000, () => {
  console.log("RUNNING");
});
