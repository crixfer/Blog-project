import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const adminLayout = "layouts/admin";
const jwtSecret = process.env.JWT_SECRET;
console.log("JWT Secret:", jwtSecret); // Checking: This should print the JWT_SECRET

/**
 *  Check Login
 */

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

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
 * POST
 * Admin - Check Login
 */

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Check Login
 */

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Create New Post
 */

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create New Post
 */

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    if (!req.body.title || !req.body.body) {
      //avoid empty fields or undefined ones
      return res.status(400).json({ message: "Title and body are required" });
    }
    await Post.create({
      title: req.body.title,
      body: req.body.body,
    });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//check login alt

// router.post("/", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("You are logged in.");
//     } else {
//       res.send("Wrong username and password!");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * POST
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
