let builder = require('botbuilder');
let { expect } = require('chai');
var assert = require('assert');
let bot = require('../../chatbot/bot');
let cancelDialog = require('../../chatbot/dialogs/cancel');


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
            session => session.beginDialog('CancelDialog'),
            session => session.send('done')
        ]);

        bot.dialog('CancelDialog', cancelDialog.callback);
        bot.dialog('SomethingElseDialog', function(){});

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('Cancelling...');
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