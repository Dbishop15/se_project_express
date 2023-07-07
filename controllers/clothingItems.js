const ClothingItem = require("../models/clothingItem");

const {
  INVALID_DATA_ERROR,
  FORBIDDEN_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findOne({ _id: itemId })
    .then((item) => {
      if (!item) {
        return res
          .status(NOTFOUND_ERROR.error)
          .send({ message: "Item not found" });
      }
      if (!item.owner.equals(userId)) {
        return res.status(FORBIDDEN_ERROR.error).send({
          message: "You do not have the permission to delete this item",
        });
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userId })
        .then(() => {
          res.send({ message: "Successfully deleted" });
        })
        .catch(() => {
          res
            .status(DEFAULT_ERROR.error)
            .send({ message: "An error has occured on the server" });
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOTFOUND_ERROR.error).send({ message: "Item not found" });
      } else {
        res.send({ message: "Item liked" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOTFOUND_ERROR.error).send({ message: "Item not found" });
      } else {
        res.send({ message: "Item disliked" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
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
