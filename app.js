import dotenv from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import mainRoutes from "./server/routes/main.js";

dotenv.config();

const app = express();
const PORT = 2000;

app.use(express.static("public"));

//Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", mainRoutes);

//listening port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
