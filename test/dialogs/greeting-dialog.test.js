let builder = require('botbuilder');
let { expect } = require('chai');
var assert = require('assert');
let bot = require('../../chatbot/bot');
let greetingDialog = require('../../chatbot/dialogs/greeting');


describe('Greeting Dialog', () => {

    let bot;
    let step;
    let connector;
    before(() => {
        step = 0;
        connector = new builder.ConsoleConnector();
        bot = new builder.UniversalBot(connector);
    })

    it('Should pass the entire flow', function (done) {
        bot.dialog('/', [
            session => session.beginDialog('GreetingDialog'),
            session => session.send('done')
        ]);

        bot.dialog('GreetingDialog', greetingDialog.callback);
        bot.dialog('HelpDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.type).to.equal('typing');
                    break;
                case 2:
                    expect(message.text).to.equal('Hello there! I\'m the agenbot, and i\'m here to help you manage your contacts. If you need help, type: help');
                    break;
                case 3:
                    expect(message.text).to.equal('done');
                    done();
                    break;
                default:
                    break;
            }
        });

        connector.processMessage('Hello');

    }).timeout(20000);

});