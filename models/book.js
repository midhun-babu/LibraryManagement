import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true
    },

    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [150, "Author name cannot exceed 150 characters"],
      index: true
    },

    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
      match: [/^(?:\d{10}|\d{13})$/, "ISBN must be a valid 10 or 13 digit number"],
      index: true
    },

    totalCopies: {
      type: Number,
      default: 1,
      min: [0, "Copies cannot be negative"]
    },

    issuedCopies: {
      type: Number,
      default: 0,
      min: 0
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  }
);

bookSchema.virtual("availabilityStatus").get(function () {
  const available = this.totalCopies - this.issuedCopies;
  return available > 0 ? "available" : "unavailable";
});

bookSchema.virtual("availableCopies").get(function () {
  return this.totalCopies - this.issuedCopies;
});


bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

bookSchema.index({ title: 1, author: 1 });

export default mongoose.model("Book", bookSchema);