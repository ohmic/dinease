const monggoose = require("mongoose");

const emailOtpSchema = new monggoose.Schema({
  email: String,
  otp: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

module.exports = monggoose.model("EmailOtp", emailOtpSchema);
