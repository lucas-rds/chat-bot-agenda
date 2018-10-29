
const { typing } = require('../util/session');

module.exports = {
    name: 'GreetingDialog',
    trigger: { matches: 'Greeting' },
    callback: [
        function one(session) {
            typing(session, 300).then(() => {
                session.send(`Hello there! I'm the agenbot, and i'm here to help you manage your contacts. If you need help, type: help`);
                session.endDialog();
                session.beginDialog("HelpDialog");
            })
        }
    ],
}