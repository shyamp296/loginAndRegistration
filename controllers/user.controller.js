require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../models/user.models");

const trasporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  console.log(
    "🚀 ~ file: user.controller.js:20 ~ exports.postLogin= ~ er̥rors:",
    errors
  );

  try {
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      res.status(411).json({ message: alert });
    } else {
      const userData = await User.findOne({ userEmail: email });
      const match = await bcrypt.compare(password, userData.userPassword);
      if (match) {
        const token = jwt.sign(
          { userEmail: userData.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "4h" }
        );

        res.status(201).json({
          success: true,
          message: "logged in successfully",
          data: { token: token },
        });
        //Send Email
        const message = {
          from: process.env.EMAIL,
          to: email,
          subject: "OTP",
          html: `<p>You are successfully Login<\p>`,
        };
        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent ...", info.response);
          }
        });
        res
          .status(201)
          .json({
            message: "Successfully Logged In",
            success: "true",
            data: {},
          });
      } else {
        res.status(411).json({ message: "Password does not match" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      console.log(
        "🚀 ~ file: user.controller.js:92 ~ exports.postSignup= ~ alert:",
        alert
      );
      res.status(411).json({ message: alert });
    } else {
      const hashPassword = await bcrypt.hash(password, 12);
      const user = await new User({
        userName: name,
        userEmail: email,
        userPassword: hashPassword,
        createdAt: Date.now(),
      });
      const savedData = await user.save();
      console.log("Register Successfully");
      //Send Email
      const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Register",
        html: `${name} has successfully register.`,
      };
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent ...", info.response);
        }
      });
      res.status(201).json({ message: "Register Success" });
    }
  } catch (error) {
    console.log(error);
  }
};
