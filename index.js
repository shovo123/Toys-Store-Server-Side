const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Car Is Running')
})

// Middleware
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9k9az0h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('toysShop').collection('toys');

    // Search 

    // const indexKeys ={carName:1, subCategory:1};
    // const indexOptions = {name:"carNameSubCategory"};
    // const result = await toysCollection.createIndex(indexKeys,indexOptions);


    // app.get("/toy/:text",async(req,res)=>{
    //   const text =req.params.text;
    //   const result= await toysCollection
    //   .find({
    //     $or:[
    //       {carName:{$regex:text, $options:"i"}},
    //       {SubCategory:{$regex:text, $options:"i"}},
    //     ],
    //   }).toArray();
    //   res.send(result);
    // })

     // Posting Data
     app.post('/toys', async (req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body)
      res.send(result)

    })

    // Get Data
    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // Only My Job 

    app.get('/myToys/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await toysCollection.find({ sellerEmail: req.params.email }).toArray();
      res.send(result);
    })

      // User Load 
      app.get('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const user = await toysCollection.findOne(query);
        res.send(user)
  
      })
  
      // Update Single Toy 
      app.put('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedToys = req.body;
        const toy = {
          $set: {
            carName: updatedToys.carName,
            pictureUrl: updatedToys.pictureUrl,
            rating: updatedToys.rating,
            price: updatedToys.price,
            sellerName: updatedToys.sellerName,
            quantity: updatedToys.quantity,
            subCategory: updatedToys.subCategory,
            description: updatedToys.description,
            sellerEmail: updatedToys.sellerEmail
  
          }
        }
        const  result =await toysCollection.updateOne(filter,toy,options);
        res.send(result)
      })

      
    // Delete 
    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Car Is Running on Port: ${port}`)
})
