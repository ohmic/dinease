const monggoose = require("mongoose");

const mobileOtpSchema = new monggoose.Schema({
  mobile: String,
  otp: Number,
  createdAt: {
    type: Date,
    default: Date.now, 
    expires: 300, 
  },
});

module.exports = monggoose.model("MobileOtp", mobileOtpSchema);