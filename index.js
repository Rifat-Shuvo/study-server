const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://shuvo:shuvo2812@cluster0.dnlmit0.mongodb.net/?retryWrites=true&w=majority";

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

    //database
    const database = client.db('study')
    //dataCollection
    const allcollection = database.collection('allAssignment')
    const submitcollection = database.collection('submitted')
    //added assignment
    app.post('/allassign', async(req,res)=>{
        const add = req.body
        // console.log(add)
        const result = await allcollection.insertOne(add)
        res.send(result)
    })

    app.get('/allassign', async(req,res)=>{
      const cursor = allcollection.find()
      const result = await cursor.toArray()
      // console.log(result);
      res.send(result)
    })

    app.get('/details/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await allcollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    app.put('/update/:id', async(req,res)=>{
      const id =req.params.id
      const assign = req.body
      console.log(id,assign);
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedAssign = {
        $set:{
          title: assign.title,
          thumbnail: assign.thumbnail,
          total: assign.total,
          date: assign.date,
          description: assign.description,
          difficulty: assign.difficulty,
          useremail: assign.useremail
        }
      }

      const result = await allcollection.updateOne(filter,updatedAssign,options)
      res.send(result)
    })

    app.delete('/assign/:id/:email', async(req,res)=>{
      const id = req.params.id
      const email = req.params.email
      console.log('delete', id , email);
      const query = {_id: new ObjectId(id)}
      const result = await allcollection.deleteOne(query)
      res.send(result)
    })

    //second phase
    app.post('/taken',async(req,res)=>{
      const takes = req.body
      // console.log(takes);
      const result = await submitcollection.insertOne(takes)
      res.send(result)
    })
    app.get('/takens', async(req,res)=>{
      const cursor = submitcollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/mark/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await submitcollection.findOne(query)
      res.send(result)
    })
    // app.put('/mark/:id', async(req,res)=>{
    //   const id =req.params.id
    //   const allmark = req.body
    //   console.log(id,assign);
    //   const filter = {_id: new ObjectId(id)}
    //   const options = {upsert: true}
    //   const updatedMark = {
    //     $set:{
    //       name:allmark.name,
    //       mark:allmark.mark,
    //       notes:allmark.notes,
    //       status:allmark.status,
    //       takemail:allmark.takemail
    //     }
    //   }

    //   const result = await submitcollection.updateOne(filter,updatedMark,options)
    //   res.send(result)
    // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send(`hello from ${port}`)
})

app.listen(port, ()=>{
    console.log(`The app is running on port ${port}`);
})