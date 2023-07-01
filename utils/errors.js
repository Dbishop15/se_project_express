const ERROR_CODE = {
  BadRequest: 400,
  Forbidden: 403,
  NotFound: 404,
  ServerError: 500,
};
function handleError(err, res, err) {
  if (err.name === "ValidationError") {
    return res
      .status(ERROR_CODE.BadRequest)
      .send({ message: "Invalid data or id passed" });
  }
  if (err.name === "ForbiddenError") {
    return res
      .status(ERROR_CODE.Forbidden)
      .send({ message: "No authorized to access the content" });
  }
  if (err.name === "NotFoundError") {
    return res.status(ERROR_CODE.NotFound).send({ message: "No item found" });
  }
  return res
    .status(ERROR_CODE.ServerError)
    .send({ message: "An error has occured on the server" });
}

module.exports = {
  handleError,
};
