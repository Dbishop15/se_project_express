const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const ConFlictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: users });
      }
    })
    .catch((next) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    next(new BadRequestError("Password is required"));
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
        return next(new BadRequestError("Invalid data provided"));
      } else if (err.code === 11000) {
        next(
          new ConFlictError(
            "This email address is already used with an account"
          )
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("Email or Password not found"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new UnauthorizedError("Email or Password not found"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch((next) => {
      next(
        new UnauthorizedError(
          "Login is denies due to invalid email or password"
        )
      );
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
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
