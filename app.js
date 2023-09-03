var express = require('express')
var bodyParser = require('body-parser')
require('dotenv').config()
const fetch = require("node-fetch")
let OpenAI = require('openai');

openAIToken = process.env["OPENAI_API_KEY"]
const openai = new OpenAI({
    apiKey: openAIToken
  });

const port = 3000;

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json()

app.use(express.static('public'))

async function createEmbedding(input, model="text-embedding-ada-002") {
    try {
        const rawResponse = await fetch("https://api.openai.com/v1/embeddings", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${openAIToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input,
                model
            })
        })
        const response = await rawResponse.json()
        console.log(response.usage)

    } catch(err) {
        console.error(err)
    }

}

app.post("/searchSite", async (req, res) => {

    let searchText = req.body.searchText;

    createEmbedding({
        input: searchText
    })

    results = [{
        text: 'aaa',
        link: 'http://yahoo.com'
    }, {
        text: 'bbb',
        link: 'http://openai.com'
    }]

    req.app.set('results', results);
    req.app.set('prompt', searchText)
    res.redirect("/searchResults");
})

app.get("/searchResults", (req, res) => {
    let jsonResults = req.app.get('results')
    console.log(jsonResults);

    res.render('results.jade', { title: 'Curiosity', data: jsonResults })

    // res.setHeader('Content-Type', 'application/json');
    // res.send(jsonResults)
    // res.end(JSON.stringify(jsonResults));
})

app.listen(port, function () {
    console.log(`Listening on port ${port}!`);
});