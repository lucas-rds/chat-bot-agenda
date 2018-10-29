const builder = require('botbuilder');
const service = require('../service');

module.exports = {
    name: 'SomethingElseDialog',
    trigger: { matches: 'SomethingElse' },
    callback: [
        function askPersonName(session) {
            session.send("Ok, What do you wanna do now?");
            session.endDialog();
            session.beginDialog("HelpDialog");
        }
    ],
}