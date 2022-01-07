const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema(
  {
    name: {
      type: String
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: 'languages'
    },
    price: {
      type: Number
    },
    description: {
      type: String
    },
    detail: {
      type: String
    },
    photos: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = Portfolio = mongoose.model("portfolios", PortfolioSchema);
