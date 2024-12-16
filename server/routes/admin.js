import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const adminLayout = "layouts/admin";
const jwtsecret = process.env.JWT_SECRET;

/**
 * GET
 * Admin - Login Page
 */

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("admin/login", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET
 * Admin - Check Login Page
 */

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Admin - Check Login Page
 */

router.get("/dashboard", async (req, res) => {
  res.render("admin/dashboard");
});

/**
 * GET
 * Admin - Register
 */

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedpassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;

//check login alt

// router.post("/", async (req, res) => {
//     try {
//       const { username, password } = req.body;

//       if (req.body.username === "admin" && req.body.password === "password") {
//         res.send("You are logged in.");
//       } else {
//         res.send("Wrong username and password!");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
