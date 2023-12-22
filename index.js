const express = require('express')
const cors=require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors( {
  origin:['http://localhost:5173'],
  credentials:true
}))




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://taskManager:IhkSkYler70sgEOz@cluster0.t1ncqa9.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db('taskManager')
    const tasksCollection = database.collection('allTask');


    app.post('/task',async(req,res)=>{
      const tasks=req.body;
      const result=await tasksCollection.insertOne(tasks);
      res.send(result)
    })

    app.get('/getTask',async(req,res)=>{
      const result=await tasksCollection.find().toArray();
      res.send(result)
    })

    
    app.get('/getTask/:email',async(req,res)=>{
      const email=req.params.email;
      const result=await tasksCollection.find({email:email}).toArray();
      res.send(result);
  })


    app.delete('/getTask/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await tasksCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/getTask/new/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await tasksCollection.findOne(query)
        res.send(result)
      })


 app.patch('/getTask/v1/v2/:id',async(req,res)=>{
        const item=req.body;
        const id=req.params.id;
        const filter={_id: new ObjectId(id)}
        const updatedDoc={
          $set:{
            name:item.name,
            type:item.type,
            status:item.status,
            description:item.description,
            date:item.date
          }
        }
        const result=await tasksCollection.updateOne(filter,updatedDoc)
        res.send(result)
      })




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})