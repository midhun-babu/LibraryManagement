import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["librarian", "user"],
    required: true,
    default: "user",
  },
  name: { type: String, required: true },
  uname: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  isDeleted:{type:Boolean,default:false}
});

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });


export default mongoose.model("User",userSchema);
