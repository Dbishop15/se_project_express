const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../errors/BadRequestError");
// const { ConFlictError } = require("../errors/ConflictError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");
// const { UnauthorizedError } = require("../errors/UnauthorizedError");

// const {
//   INVALID_DATA_ERROR,
//   FORBIDDEN_ERROR,
//   NOTFOUND_ERROR,
//   DEFAULT_ERROR,
// } = require("../utils/errors");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(err);
      // res
      //   .status(DEFAULT_ERROR.error)
      //   .send({ message: "An error has occured on the server" });
    });
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
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

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        // res.status(NOTFOUND_ERROR.error);
        return next(new NotFoundError("Item not found"));
      }
      if (!item.owner.equals(userId)) {
        // res.status(FORBIDDEN_ERROR.error);
        next(new ForbiddenError("User not authorized to delete item"));
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userId })
        .then(() => {
          res.send({ message: "Successfully deleted" });
        })
        .catch((err) => {
          next(err);
          // res
          //   .status(DEFAULT_ERROR.error)
          //   .send({ message: "An error has occured on the server" });
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
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

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
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

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        // res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
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
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
