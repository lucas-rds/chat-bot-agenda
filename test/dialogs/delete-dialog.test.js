let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let deleteDialog = require('../../chatbot/dialogs/delete');
let service = require('../../chatbot/service');


describe('Delete Dialog', () => {
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
        serviceStub = sinon.stub(service, 'deleteContact')
            .resolves(null, 'lucas saved succefully! :)')
        serviceStub = sinon.stub(service, 'queryContact')
            .resolves({ RowKey: "lucas", filledname: "lucas", phone: "123456" })

        bot.dialog('/', [
            session => session.beginDialog('DeleteDialog'),
            session => session.send('done')
        ]);

        bot.dialog('DeleteDialog', deleteDialog.callback);
        bot.dialog('HelpDialog', function () { });
        bot.dialog('SomethingElseDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('Who do you want to delete?');
                    connector.processMessage('lucas');
                    break;
                case 2:
                    expect(message.text).to.equal('Are you sure you want to delete this contact? lucas, 123456.');
                    connector.processMessage('yes');
                    break;
                case 3:
                    expect(message.text).to.equal('Ok then, deleting from phonebook...');
                    break;
                case 4:
                    expect(message.type).to.equal('typing');
                    break;
                case 5:
                    expect(message.text).to.equal('lucas deleted succefully! :)');
                    break;
                case 6:
                    expect(message.text).to.equal('done');
                    done();
                    break;
                default:
                    break;
            }
        });

        connector.processMessage('I want to delete a person');

    }).timeout(20000);

});