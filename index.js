const express = require("express");
const app = express();
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzyej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const hotelCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("hotels");
  const experienceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("experience");
  const homeFeatureCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("features");

  app.post("/addHotels", (req, res) => {
    const hotel = req.body;
    hotelCollection.insertOne(hotel).then((result) => {
      res.send(result.insertedCount > 0);
      // console.log(result);
    });
  });
  app.get("/experiences", (req, res) => {
    experienceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.post("/addExperience", (req, res) => {
    experienceCollection.insertMany(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addHomeDetails", (req, res) => {
    homeFeatureCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/homeDetails/:key", (req, res) => {
    const providedKey = req.params.key;
    homeFeatureCollection
      .find({ key: providedKey })
      .toArray((err, document) => {
        res.send(document);
      });
  });
  app.get("/hotels", (req, res) => {
    hotelCollection.find({}).toArray((error, documents) => {
      res.send(documents);
    });
  });
});
app.listen(process.env.PORT || 5000);
