const express = require('express');
const tmi = require('tmi.js');
const fs = require('fs');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

const config = JSON.parse(fs.readFileSync('config.json'));

const options = {
    options: {
        debug: config.twitch.debug
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: config.twitch.bot_username,
        password: config.twitch.oauth
    },
    channels: [config.twitch.channel]
};

const client = new tmi.client(options);

const https = require('https').createServer(options, app);
const http = require('http').createServer(app);

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log(req.body);
    client.say(config.twitch.channel, `New donation!`);
    res.send("OK");
});

app.get('/', (req, res) => {
    if (req.protocol == 'https')
        res.redirect(`http://${config.webhook.hostname}:${config.webhook.port}`);
});

app.post('/', (req, res) => {
    if (req.protocol == 'https')
        res.redirect(`http://${config.webhook.hostname}:${config.webhook.port}`);
});

// app.listen(config.webhook.port, () => console.log(`Webhook running on ${config.webhook.hostname}:${config.webhook.port}!`));

client.connect();
client.on('connected', (adress, port) => {
    if (config.twitch.showJoinMessage) {
        client.action(config.twitch.channel, config.twitch.joinMessage);
    }
});

http.listen(config.webhook.port, () => console.log(`Server started at ${config.webhook.hostname}:${config.webhook.port}`));
https.listen(433, () => console.log(`Redirect to HTTP from ${config.webhook.hostname}:443`));