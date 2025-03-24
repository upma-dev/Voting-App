const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../auth");

//Signup Route
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    // validate only admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user alerady exists" });
    }

    // Validate Aadhar card number
    const aadharCardNumberPattern = /^\d{12}$/;
    if (!aadharCardNumberPattern.test(data.aadharCardNumber)) {
      return res.status(400).json({
        error: "Invalid Aadhar card number. It must be a 12-digit number.",
      });
    }

    // Check if the user with same aadhar card number exists
    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User with the same aadhar card number alerady exists",
      });
    }

    const newUser = new User(data);

    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login Route

router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    if (!aadharCardNumber || !password) {
      return res
        .status(400)
        .json({ error: "Aadhar card number and password are required" });
    }

    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    //if the user does not exist or password is incorrect
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid Aadhar card number or password" });
    }
    // generate token

    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// /user/profile check kar paye ya dekh paye

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// code for changing password by the user//use put because we want to update password

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // userData = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
