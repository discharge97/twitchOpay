const express = require('express');
const tmi = require('tmi.js');
const fs = require('fs');
const bodyParser = require('body-parser')
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
app.use(bodyParser.json());
app.post('/', (req, res) => {
    console.log(req.body);
    client.say(config.twitch.channel, "<username> has donaited 5$! Thank you!");
    res.send("OK");
});

app.listen(config.webhook.port, () => console.log(`Webhook running on ${config.webhook.hostname}:${config.webhook.port}!`));


client.connect();
client.on('connected', (adress, port) => {
    if (config.twitch.showJoinMessage) {
        client.action(config.twitch.channel, config.twitch.joinMessage);
    }
});