
require('dotenv').config();

const builder = require('botbuilder');
const restify = require('restify');
const bot = require('./chatbot/bot');

const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

let agenbot = bot.create(connector);

// Setup Restify Server
const server = restify.createServer();
const port = process.env.port || process.env.PORT || 3978;
server.listen(port, () => console.log(`${server.name} listening to ${server.url}`));
server.post('/api/messages', connector.listen());