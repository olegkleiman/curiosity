var express = require('express')
var bodyParser = require('body-parser')

const port = 3000;

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json()

app.use(express.static('public'))

app.post("/searchSite", (req, res) => {

    let searchText = req.body.searchText;

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