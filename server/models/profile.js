const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    userId: {
      type: String,
      required: true
    },
    company: {
      type: String
    },
    website: {
      type: String
    },
    status: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      required: true
    },
    bio: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
