const express = require("express");

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const cors = require("cors");

const routes = require("./routes");

const app = express();

const helmet = require("helmet");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

app.use(helmet());

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
