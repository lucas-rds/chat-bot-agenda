let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let editDialog = require('../../chatbot/dialogs/edit');
let phonePrompt = require('../../chatbot/dialogs/phone-prompt');
let service = require('../../chatbot/service');


describe('Edit Dialog', () => {
    let serviceStub;
    let bot;
    let step;
    let connector;

    before(() => {
        step = 0;
        connector = new builder.ConsoleConnector();
        bot = new builder.UniversalBot(connector);
    })

    after(() => {
        serviceStub.restore();
    });

    it('Should pass the entire flow', function (done) {
        serviceStub = sinon.stub(service, 'insertContact')
            .resolves(null, 'lucas saved succefully! :)')
        serviceStub = sinon.stub(service, 'queryContact')
            .resolves({ RowKey: "lucas", filledname: "lucas", phone: "123456" })

        bot.dialog('/', [
            session => session.beginDialog('EditDialog'),
            session => session.send('done')
        ]);

        bot.dialog('EditDialog', editDialog.callback);
        bot.dialog('PhonePrompt', phonePrompt.callback);
        bot.dialog('HelpDialog', function () { });
        bot.dialog('SomethingElseDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('What\'s the name of the contact you want to edit?');
                    connector.processMessage('lucas');
                    break;
                case 2:
                    expect(message.text).to.equal('This one? lucas, 123456.');
                    connector.processMessage('yes');
                    break;
                case 3:
                    expect(message.text).to.equal('What\'s the phone number?');
                    connector.processMessage('50505050');
                    break;
                case 4:
                    expect(message.text).to.equal('Ok then, saving this person in your phonebook...');
                    break;
                case 5:
                    expect(message.type).to.equal('typing');
                    break;
                case 6:
                    expect(message.text).to.equal('lucas saved succefully! :)');
                    break;
                case 7:
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