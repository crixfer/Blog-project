import dotenv from "dotenv";
dotenv.config();

import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import mainRoutes from "./server/routes/main.js";
import adminRoutes from "./server/routes/admin.js";
import connectDB from "./server/config/db.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import isActiveRoute from "./server/helpers/routeHelpers.js";

console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const PORT = 2000;

// connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie:  {maxAge: new Date (Date,now() + (3600000))}
  })
);

app.use(express.static("public"));

// Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

app.use((req, res, next) => {
  res.locals.currentRoute = req.path; // ✅ Makes `currentRoute` available globally
  next();
});

app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// listening port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
