const builder = require('botbuilder');
const recognizer = new builder.LuisRecognizer(process.env.LuisModelUrl);
module.exports = recognizer;