const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountSid = "ACac6edd26d6c0dc756d82cc6d08014b2b";
const authToken = "e70f7e04ae1650cb9f1442b43326c5a8";
const client = require("twilio")(accountSid, authToken);
const fast2sms = require("fast2sms");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const MobileOtp = require("../../models/mobileOtp");
const EmailOtp = require("../../models/emailOtp");
const { OAuth2Client } = require("google-auth-library");
const emailOtp = require("../../models/emailOtp");
const mobileOtp = require("../../models/mobileOtp");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginUser = async (req, res) => {
  const { googleToken } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture, email_verified } = ticket.getPayload();
    if (email_verified) {
      // Find or create user
      let checkUser = await User.findOne({ email: email });
      // if (!user) {
      //   user = await User.create({
      //     name,
      //     email,
      //     googleId: sub,
      //     profilePicture: picture,
      //   });
      // }
      if (checkUser) {
        const token = jwt.sign(
          {
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName,
          },
          "CLIENT_SECRET_KEY",
          { expiresIn: "30d" }
        );
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
          })
          .json({
            success: true,
            message: "Logged in successfully",
            user: {
              email: checkUser.email,
              role: checkUser.role,
              id: checkUser._id,
              userName: checkUser.userName,
            },
          });
      } else {
        res.status(400).json({
          success: false,
          message: "User not exists! Please Signup first",
        });
      }
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Google login failed", error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -updatedAt").lean();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//register
const registerUser = async (req, res) => {
  const { userName, email, mobile, password, emailOtp, mobileOtp } = req.body;
  console.log(req.body);
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const user = await User.findOne({ mobile });
    if (user)
      return res.json({
        success: false,
        message: "User Already exists with the same mobile! Please try again",
      });
    const createdEmailOtp = await EmailOtp.findOne({ email });
    const createdMobileOtp = await MobileOtp.findOne({ mobile });

    if (!createdEmailOtp || !createdMobileOtp)
      return res.json({ success: false, message: "Some error occured" });
    if (
      parseInt(emailOtp) !== createdEmailOtp.otp ||
      parseInt(mobileOtp) !== createdMobileOtp.otp
    ) {
      console.log("otp not matched");
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      createdEmailOtp.otp === parseInt(emailOtp) &&
      createdMobileOtp.otp === parseInt(mobileOtp)
    ) {
      console.log("otp matched");
      await EmailOtp.deleteMany({ email });
      await MobileOtp.deleteMany({ mobile });
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        userName,
        email,
        mobile,
        password: hashPassword,
      });

      await newUser.save();
      res.json({
        success: true,
        message: "Registration successful",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
  // try {
  //   const checkUser = await User.findOne({ email });
  //   if (checkUser)
  //     return res.json({
  //       success: false,
  //       message: "User Already exists with the same email! Please try again",
  //     });

  //   const hashPassword = await bcrypt.hash(password, 12);
  //   const newUser = new User({
  //     userName,
  //     email,
  //     password: hashPassword,
  //   });

  //   await newUser.save();
  //   res.status(200).json({
  //     success: true,
  //     message: "Registration successful",
  //   });
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).json({
  //     success: false,
  //     message: "Some error occured",
  //   });
  // }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "30d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const sendRegisterOtp = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    console.log(mobile, email);
    const checkUser = await User.findOne({ email });
    const user = await User.findOne({ mobile });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    if (user)
      return res.json({
        success: false,
        message:
          "User Already exists with the same mobile number! Please try again",
      });

    const emailOtpSent = await EmailOtp.findOne({ email });
    const mobileOtpSent = await MobileOtp.findOne({ mobile });
    if (emailOtpSent) {
      await EmailOtp.deleteMany({ email });
    }
    if (mobileOtpSent) {
      await MobileOtp.deleteMany({ mobile });
    }

    const emailOtp = Math.floor(100000 + Math.random() * 900000);
    const newEmailOtp = new EmailOtp({ email, otp: emailOtp });
    await newEmailOtp.save();
    // Send OTP via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: {
        name: "Dinease",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Your OTP Code",
      text: `Your Dinease OTP code is ${emailOtp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const newMobileOtp = new MobileOtp({ mobile, otp });
    await newMobileOtp.save();

    // const apiKey = process.env.FAST2SMS_API_KEY;
    // const options = {
    //   authorization: apiKey,
    //   message: `Your Dinease OTP code is ${otp}. It will expire in 5 minutes.`,
    //   numbers: [`${mobile}`],
    // };
    // console.log(options, "options");
    // await fast2sms.send(options);
    // client.verify.v2
    //   .services("VA980e22b9808cd12c4e0e7887b4ba4436")
    //   .verifications.create({ to: "+917012082841", channel: "sms" })
    //   .then((verification) => console.log(verification.sid));

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
    if (e.code === 11000) {
      res.status(400).json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }
  }
};
//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  sendRegisterOtp,
  authMiddleware,
  googleLoginUser,
};
