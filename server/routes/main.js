import express from "express";
const router = express.Router();

// ROUTES ------------->

// Home
router.get("/", (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb.",
  };

  res.render("index", { locals });
});

// About
router.get("/about", (req, res) => {
  res.render("about");
});

export default router;
