const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// using middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://endgameuser:q4kjDYNtixUhjwtP@cluster0.7wrk7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const taskCollection = client.db("taskDB").collection("tasks");
      
      app.get('/task', async (req, res)=>{
        const query = {completed: false}
        const cursor =  taskCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

      app.post('/task', async (req, res)=>{
        const data = req.body;
        const result = await taskCollection.insertOne(data);
        res.send(result);
      });
    
    app.patch('/task/:id', async(req, res) =>{
        const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedData = {
              $set: data
            }
            const result = await taskCollection.updateOne(filter, updatedData, options);
            res.send(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})