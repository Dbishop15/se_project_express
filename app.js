const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: "649f29361153c721e58bc584", // paste the _id of the test user created in the previous step
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
