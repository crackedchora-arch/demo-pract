import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);
