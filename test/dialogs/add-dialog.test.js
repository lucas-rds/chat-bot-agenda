let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let addDialog = require('../../chatbot/dialogs/add');
let phonePrompt = require('../../chatbot/dialogs/phone-prompt');

let service = require('../../chatbot/service');

describe('Add Dialog', () => {
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
            .resolves(null, 'lucas saved succefully! :)');

        bot.dialog('/', [
            session => session.beginDialog('AddDialog'),
            session => session.send('done')
        ]);

        bot.dialog('AddDialog', addDialog.callback);
        bot.dialog('PhonePrompt', phonePrompt.callback);
        bot.dialog('HelpDialog', function () { });
        bot.dialog('SomethingElseDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('So you want to add a new person? Please, tell me the person name.');
                    connector.processMessage('lucas');
                    break;
                case 2:
                    expect(message.text).to.equal('What\'s the phone number?');
                    connector.processMessage('38382020');
                    break;
                case 3:
                    expect(message.text).to.equal('So, is this correct? lucas, 38382020.');
                    connector.processMessage('yes');
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

        connector.processMessage('I want to add a person');

    }).timeout(20000);

});