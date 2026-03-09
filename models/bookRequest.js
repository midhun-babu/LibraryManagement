import mongoose from "mongoose";

const bookRequestSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    requestedDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["pending", "approved", "issued", "rejected"],
      default: "pending"
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    approvedDate: {
      type: Date,
      default: null
    },

    issuedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("BookRequest", bookRequestSchema);