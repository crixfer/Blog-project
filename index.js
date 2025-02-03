import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3002 || process.env.PORT;

// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("", (req, res) => {
  res.send("Hello world");
});

// app.post("/submit", (req, res) => {
//   res.render("index.ejs");
// });

app.listen((port) => {
  console.log(`Listening on port: ${PORT}.`); //port 3002
});
