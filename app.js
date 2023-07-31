require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const { errors } = require("celebrate");

const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const limiter = require("./utils/limiter");

const { PORT = 3001 } = process.env;
const cors = require("cors");

const routes = require("./routes");

const app = express();

const helmet = require("helmet");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
