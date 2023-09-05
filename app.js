import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import fetch from "node-fetch";
import OpenAI from 'openai';
import { config } from './config.js';
import Database from './database.js';

const openAIToken = process.env["OPENAI_API_KEY"]
const openai = new OpenAI({
    apiKey: openAIToken
  });

const database = new Database(config);  

const port = 3000;

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json()

app.use(express.static('public'))

async function createEmbedding(input, model="text-embedding-ada-002") {
    try {

        const jsonBody = {
            input,
            model
        }
        const rawResponse = await fetch("https://api.openai.com/v1/embeddings", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${openAIToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(jsonBody)
        })
        const response = await rawResponse.json()
        return response.data[0].embedding;

    } catch(err) {
        console.error(err)
    }

}

app.post("/searchSite", async (req, res) => {

    let searchText = req.body.searchText;

    let embedding = await createEmbedding(searchText)

    await database.connect();
    const distances = await database.execureSP('[dbo].[calculateDistance]',JSON.stringify(embedding));
    await database.disconnect()

    req.app.set('results', distances);
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