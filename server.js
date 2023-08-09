require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const URI = process.env.MONGO_URI;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const mongoClient = new MongoClient(URI);

let DB;

try {
  // Connect to the MongoDB cluster
  mongoClient.connect();
  console.log("Connected to MongoDB !");
  DB = mongoClient.db("resumebuilder");
} catch (e) {
  console.error(e);
}

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

const pdfTemplate = require("./documents");

const options = {
  height: "42cm",
  width: "35.7cm",
  timeout: 6000,
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ...

app.post("/verifyToken", (req, res) => {
  const token = req.body.token;
  jwt.verify(token, GOOGLE_CLIENT_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: err.message,
        });
      }
    }

    const email = decodedToken?.email;

    DB.collection("users")
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            message: "You are not registered. Please sign up",
          });
        } else {
          if (Date.now() < decodedToken.exp * 1000) {
            return res.status(200).json({ status: "Success" });
          }
        }
      });
  });
});

// ...

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
