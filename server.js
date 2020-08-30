const http = require('http');
const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs');
const { response } = require('express');
const path = require('path')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/', (req, res) => {
    let a = JSON.stringify(req.body);
    fs.writeFileSync('...', a, (err) => console.log(`Error: ${err}`))
})

app.get('/score', (req, res) => {
  const scores = fs.readFileSync('...', 'utf8')
  res.json(scores)
  })

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '...'))
})


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "...");
  res.header("Access-Control-Allow-Headers", "*");
  next()
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Your app is listening")
});