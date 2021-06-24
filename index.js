const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 4564

console.log('hello everything is fine');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})