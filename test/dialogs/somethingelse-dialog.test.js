let builder = require('botbuilder');
let { expect } = require('chai');
var assert = require('assert');
let bot = require('../../chatbot/bot');
let somethingElseDialog = require('../../chatbot/dialogs/somethingelse');


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
            session => session.beginDialog('SomethingElseDialog'),
            session => session.send('done')
        ]);

        bot.dialog('SomethingElseDialog', somethingElseDialog.callback);
        bot.dialog('HelpDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('Ok, What do you wanna do now?');
                    break;
                case 2:
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