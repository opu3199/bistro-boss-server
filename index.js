const express = require('express')
const app = express()
const cors=require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const cartcollection = client.db("Bistroboss").collection("cart")
    const usercollection = client.db("Bistroboss").collection("user")


    //JWT API
    // app.post('/jwt',async (req,res)=>{
    //   const user=req.body
    //   const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
    //   res.send({token})
    // })

    // //middleware
    // const verifytoken=(req,res,next)=>{
    //   console.log('inside verify token',req.headers)
    //   if(!req.headers.Authorization){
    //     return res.status(401).send({message:'forbidden access'})
    //   }
    //   const token=req.headers.Authorization.split(' ')[1]
    //   jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
    //     if(err){
    //       return res.status(401).send({message:'forbidden access'})
    //     }
    //     req.decoded=decoded
    //     next()
    //   })
    // }


    

    app.post('/user',async(req,res)=>{
      const user=req.body
      //insert email

      const query = {email:user.email}
      const existinguser=await usercollection.findOne(query)
      if(existinguser){
        return res.send({message:'user already exist',insertedId:null})
      }
      const result=await usercollection.insertOne(user)
      res.send(result)
    })

    //user realted

    app.patch('/user/admin/:id',async(req,res)=>{
      const id=req.params.id
      const filter = {_id:new ObjectId(id)}
      const upadtedoc={
        $set:{
          role:'admin',
        }
      }
      const result =await usercollection.updateOne(filter,upadtedoc)
      res.send(result)
    })

    //get user data

    app.get('/user',async(req,res)=>{
      const result=await usercollection.find().toArray()
      res.send(result)

    })

    //delete user
    app.delete('/user/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result=await usercollection.deleteOne(query)
      res.send(result)

    })



    //menu get

    app.get('/menu',async(req,res)=>{
        const result=await menucollection.find().toArray()
        res.send(result)
    })

    app.get('/menu/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result=await menucollection.findOne(query)
      res.send(result)
    })

    app.patch('/menu/:id',async(req,res)=>{
      const item =req.body
      const id = req.params.id
      const filter={_id:new ObjectId(id)}
      const upadtedoc={
        $set:{
          name:item.name,
          category:item.category,
          price:item.price,
          recipe:item.recipe,
          image:item.image

        }
      }
      const result =await menucollection.updateOne(filter,upadtedoc)
      res.send(result)
    })


//add item into menu
    app.post('/menu',async(req,res)=>{
      const menuitem=req.body;
      const result=await menucollection.insertOne(menuitem)
      res.send(result)
    })

   

    app.delete('/menu/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result=await menucollection.deleteOne(query)
      res.send(result)
    })



    app.get('/reviwe',async(req,res)=>{
        const result=await reviwecollection.find().toArray()
        res.send(result)
    })

    //cart collection

    app.post('/cart',async(req,res)=>{
      const cartitem=req.body;
      const result=await cartcollection.insertOne(cartitem)
      res.send(result)
    })

    app.get('/cart',async(req,res)=>{
      const email=req.query.email
      const query={email:email}
      const result=await cartcollection.find(query).toArray()
      res.send(result)
    })

    //delete
    app.delete('/cart/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result=await cartcollection.deleteOne(query)
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