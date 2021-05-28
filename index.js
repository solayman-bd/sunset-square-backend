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
  app.post("/addHotels", (req, res) => {
    const hotels = req.body;
    hotelCollection.insertMany(hotels).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });
  app.get("/hotels", (req, res) => {
    hotelCollection.find({}).toArray((error, documents) => {
      res.send(documents);
    });
  });
});
app.listen(process.env.PORT || 5000);
