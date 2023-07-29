const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const ConFlictError = require("../errors/ConflictError");
// const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// const {
//   DEFAULT_ERROR,
//   UNAUTHORIZED_ERROR,
//   INVALID_DATA_ERROR,
//   CONFLICT_ERROR,
//   NOTFOUND_ERROR,
// } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: users });
      }
    })
    .catch(() => {
      next(err);
      // res
      //   .status(DEFAULT_ERROR.error)
      //   .send({ message: "An error has occured on the server" });
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })

    .catch((err) => {
      if (err.name === "CastError") {
        // res.status(INVALID_DATA_ERROR.error);
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
        // res
        //   .status(DEFAULT_ERROR.error)
        //   .send({ message: "An error has occured on the server" });
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!password) {
    // res.status(INVALID_DATA_ERROR.error);
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
        // res.status(INVALID_DATA_ERROR.error);
        return next(new BadRequestError("Invalid data provided"));
      } else if (err.code === 11000) {
        // res.status(CONFLICT_ERROR.error);
        next(
          new ConFlictError(
            "This email address is already used with an account"
          )
        );
      } else {
        next(err);
        // res
        //   .status(DEFAULT_ERROR.error)
        //   .send({ message: "An error has occured on the server" });
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        // return res.staus(UNAUTHORIZED_ERROR.error);
        return next(new UnauthorizedError("Email or Password not found"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // res.status(UNAUTHORIZED_ERROR.error);
          next(new UnauthorizedError("Email or Password not found"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch(() => {
      // res.status(UNAUTHORIZED_ERROR.error);
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
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("User not found"));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        // res.status(INVALID_DATA_ERROR.error);
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(err);
        // res
        //   .status(DEFAULT_ERROR.error)
        //   .send({ message: "An error has occured on the server" });
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
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("User not found"));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // res.status(INVALID_DATA_ERROR.error);
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
        // res
        //   .status(DEFAULT_ERROR.error)
        //   .send({ message: "An error has occured on the server" });
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
