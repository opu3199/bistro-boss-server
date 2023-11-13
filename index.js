const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${ process.env.USER_DATA}:${ process.env.USER_PASS}@cluster0.nhy8bre.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const menucollection = client.db("Bistroboss").collection("menu")
    const reviwecollection = client.db("Bistroboss").collection("reviwe")
    
    app.get('/menu',async(req,res)=>{
        const result=await menucollection.find().toArray()
        res.send(result)
    })
    app.get('/reviwe',async(req,res)=>{
        const result=await reviwecollection.find().toArray()
        res.send(result)
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


app.get('/', (req, res) => {
  res.send('bistro is comming')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})