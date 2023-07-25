const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  DEFAULT_ERROR,
  UNAUTHORIZED_ERROR,
  INVALID_DATA_ERROR,
  CONFLICT_ERROR,
  NOTFOUND_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: users });
      }
    })
    .catch(() => {
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })

    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!password) {
    return res
      .status(INVALID_DATA_ERROR.error)
      .send({ message: "Password is required" });
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.send({
        name: user.name,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else if (err.code === 11000) {
        res.status(CONFLICT_ERROR.error).send({
          message: "This email address is already used with an account",
        });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};
const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res
          .staus(UNAUTHORIZED_ERROR.error)
          .send({ message: "Email or Passowrd not found" });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          res
            .status(UNAUTHORIZED_ERROR.error)
            .send({ message: "Email or Password not found" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(UNAUTHORIZED_ERROR.error)
        .send({ message: "Login is denies due to invalid email or password" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
