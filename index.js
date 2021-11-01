const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n211q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database = client.db('foodDelivery');
    const itemsCollection = database.collection('items');
    const orderCollection = database.collection('order');
    const offerCollection = database.collection('offer');

    // Post API

    app.post('/offeritems', async (req, res)=>{
      const offeritem = req.body;
      console.log('hit the post api', offeritem);
      const result = await offerCollection.insertOne(offeritem);
      console.log(result);
    })

    // get api

    app.get('/offeritems', async (req, res)=>{
      const cursor = offerCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers);
    })

    app.put('/offeritems/update/:id',async(req,res)=>{
      const options = { upsert: true };
      const updateuser = req.body
      console.log(req.body);
      const id= req.params.id
      const filter = {_id:ObjectId(id)}
      
      const updateDoc = {
          $set: {
           name: updateuser.name,
           email: updateuser.email
          },
        };
        const result = await offerCollection.updateOne(filter,updateDoc,options)
     console.log("updating",id);
      res.send(result)
  })

    // GET API
    app.get('/burgeritems', async(req, res)=>{
      const cursor = itemsCollection.find({});
      const items = await cursor.toArray();
      res.send(items);
    })

    // POST API
    app.post('/burgeritems', async(req,res) => {
      const burgeritem = req.body;
      console.log('hit the post api', burgeritem);
        const result = await itemsCollection.insertOne(burgeritem);
        console.log(result);
        res.json(result);
    })
// get app findone

    app.get('/detailitems/:id', async (req, res) => {
      const result = await itemsCollection.findOne({_id:ObjectId(req.params.id)})
    res.send(result)
    })
    
    // POST method
    app.post('/addOrders',async (req, res)=>{
      console.log(req.body);
      const result = await orderCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
      
    })
    // GET Method
    app.get('/allOrders', async (req, res)=>{
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });


    // Delete Method
    app.delete("/deleteOrder/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
  
    
  }
  finally{

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});

// 0mVNABl6y5xrfbc7
// foodDelivery