const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "token is required"],
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "userId is required"],
    index: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
  },
});

// TTL index - automatically delete documents after 3 days
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;
