import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import mainRoutes from "./server/routes/main.js";
import adminRoutes from "./server/routes/admin.js";
import connectDB from "./server/config/db.js";

dotenv.config();

const app = express();
const PORT = 2000;

// connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// listening port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
