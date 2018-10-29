let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let helpDialog = require('../../chatbot/dialogs/help');
let service = require('../../chatbot/service');


describe('Edit Dialog', () => {
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
            session => session.beginDialog('HelpDialog'),
            session => session.send('done')
        ]);

        bot.dialog('HelpDialog', helpDialog.callback);
        bot.dialog('AddDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('I can do these operations in your contact list:');
                    connector.processMessage('add');
                    break;
                case 2:
                    expect(message.text).to.equal('done');
                    done();
                    break;
                default:
                    break;
            }
        });

        connector.processMessage('I want to edit a person');

    }).timeout(20000);

});