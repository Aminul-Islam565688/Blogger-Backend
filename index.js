const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const fileUpload = require('express-fileupload')
const app = express()


app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload())

const port = process.env.PORT || 4564


const uri = "mongodb+srv://test:test@cluster0.aifw0.mongodb.net/Blogger?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("Blogger").collection("Admin");
    const BlogCollection = client.db("Blogger").collection("Blogs");
    // perform actions on the collection object

    // for Login
    app.post('/login', (req, res) => {
        const adminEmail = req.body.email;
        const adminPassword = req.body.password;
        collection.find({ email: adminEmail, password: adminPassword })
            .toArray((err, document) => {
                res.send(document)
            })
    })

    // for Post Blog
    app.post('/postblog', (req, res) => {
        const file = req.files.file
        const title = req.body.title
        const content = req.body.content

        const newImg = file.data;
        const encImg = newImg.toString('base64')

        const image = {
            contentType: file.mimeType,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }

        BlogCollection.insertOne({ image, title, content })
            .then((result) => {
                res.send(result.insertedCount > 0)
            })

    })

    // for Get all Blogs
    app.get('/allblogs', (req, res) => {
        BlogCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    // for Specific Blogs Data
    app.get('/fullblog/:id', (req, res) => {
        const id = req.params.id;
        console.log(id);
        BlogCollection.find({ "_id": ObjectId(id) })
            .toArray((err, document) => {
                res.send(document);
            })
    })

    // for Deleteing the Specific Blogs
    app.delete('/deleteblog/:id', (req, res) => {
        BlogCollection.deleteOne({ "_id": ObjectId(req.param.id) })
            .then((err, result) => {
                res.send(err.deleteCount > 0);
            })
    })


    console.log('MongoDB is Connected');
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})