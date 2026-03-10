import mongoose from "mongoose";

export const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).send(`Invalid ${paramName}`);
  }
  next();
};