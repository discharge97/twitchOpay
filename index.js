const tmi = require('tmi.js');

const options = {
    options: {
        debug: true
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: "discharge97",
        password: "oauth:csmcnoo2jjs4d3ykdgqghcm8a7o630"
    },
    channels: ['discharge97']
};

const client = new tmi.client(options);

client.connect();

client.on('connected', (adress, port) => {
    client.action('discharge97', "Hello, discharge97 is here!");
});