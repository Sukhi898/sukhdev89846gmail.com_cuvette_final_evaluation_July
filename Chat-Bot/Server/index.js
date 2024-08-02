require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  cors({
    origin: "https://formbot-api-nwz1.onrender.com",
    // https://formbot-api-nwz1.onrender.com/
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/form/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use("/api", require("./src/Routers/chatbot"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
