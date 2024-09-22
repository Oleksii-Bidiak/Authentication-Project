const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/index.js");
const { connect } = require("mongoose");
const errorMiddleware = require("./middlewares/api-middleware.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connect(process.env.DB_URL);

    app.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
