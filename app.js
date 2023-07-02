const express = require("express");

const rateLimit = require("express-rate-limit");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many API requests from this IP, please try again after 15 min.",
});
const helmet = require("helmet");
app.use(helmet());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

const routes = require("./routes");

app.use(limiter);
app.use((req, res, next) => {
  req.user = {
    _id: "649f29361153c721e58bc584",
  };
  next();
});

app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
