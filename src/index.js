'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const slackgun = require('./gun');

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./client'));

app.use('/send', async function(req, res) {
    try {
        res.send(await slackgun(req.body));
    } catch (e) {
        console.log(e)
        res.status(400).send({ error: e.data.error });
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;