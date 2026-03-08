import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  copies: { type: Number, default: "1" },
  availabilityStatus: {
    type: String,
    enum: ["available", "issued"],
    default: "available",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    
    default:"null"
  },

 
  isDeleted:{type:Boolean,default:false}

});

export default mongoose.model("Book", bookSchema);
