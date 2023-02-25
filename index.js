const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 2
app.use(cors());
app.use(express.json());
// async await 
// user: dbuser2
//password:sVD78fM6pHqFuAgD


 // connection with database and server
const uri = "mongodb+srv://dbuser2:sVD78fM6pHqFuAgD@cluster0.wxn0c7p.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');
         // read 
        app.get('/users', async(req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)} ;
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // 1st steps data get from client // create
        app.post('/users', async (req, res) =>{
           const user = req.body;
           console.log(user);
          //2nd data send to database
          const result = await userCollection.insertOne(user)
          res.send(result);
        });

        app.put('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id) };
            const user = req.body;
            const option = {upsert: true};
            const updatedUser ={
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email,
                    country: user.country
                }
            }
          const result = await userCollection.updateOne(filter, updatedUser, option);
          res.send(result);
        });
        // delete api 
        app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = { _id: ObjectId(id) }
          //console.log('try to delete', id);
          const result = await userCollection.deleteOne(query);
          console.log(result);
          res.send(result);

        });

       }
    finally {

    }

}

run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});


// try{
    
    // console.log(result);
   // manually data send to database using in try into
// const user = {
//     name: 'testing test',
//     email: 'testing@gmail.com'
// }
//const result = await userCollection.insertOne(user);

// }
// catch(error){

// }
// finally{

// }

