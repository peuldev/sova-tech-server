const express = require("express");
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sova.04n0q2g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productcollection = client.db("productDB").collection("product");
    const devicecollection = client.db("productDB").collection("device");
    const cartscollection = client.db("productDB").collection("carts");

    app.get("/newproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productcollection.findOne(query);
      res.send(result);
    });

    app.get("/newproduct", async (req, res) => {
      const cursor = productcollection.find();
      const resut = await cursor.toArray();
      res.send(resut);
    });

    // load divice data
    app.get("/device", async (req, res) => {
      const cursor = devicecollection.find();
      const resut = await cursor.toArray();
      res.send(resut);
    });
    app.get("/device/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await devicecollection.findOne(query);
      res.send(result);
    });
    app.get("/carts", async (req, res) => {
      const cursor = cartscollection.find();
      const resut = await cursor.toArray();
      res.send(resut);
    });
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartscollection.deleteOne(query);
      res.send(result);
    });
    app.post("/carts", async (req, res) => {
      const device = req.body;
      const result = await cartscollection.insertOne(device);
      res.send(result);
    });
    app.put("/newproduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          title: updateProduct.title,
          price: updateProduct.price,
          stock: updateProduct.stock,
          code: updateProduct.code,
          color: updateProduct.color,
          brand: updateProduct.brand,
          photo: updateProduct.photo,
          details: updateProduct.details,
        },
      };
      const result = await productcollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.post("/newproduct", async (req, res) => {
      const newproduct = req.body;
      console.log(newproduct);
      const result = await productcollection.insertOne(newproduct);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Sova Tech Server !!!");
});

app.listen(port, () => {
  console.log(`sova tech server running on port ${port}`);
});
