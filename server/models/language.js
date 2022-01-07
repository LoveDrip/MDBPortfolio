const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema(
  {
    name: {
        type: String
    },
    description: {
        type: String
    },
    child: {
        type: Boolean,
        default: false
    },
    parent: {
        type: String,
        default: '-1'
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = Language = mongoose.model("languages", languageSchema);
