let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let service = require('../../chatbot/service');
let searchDialog = require('../../chatbot/dialogs/search');


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
        serviceStub = sinon.stub(service, 'queryContact')
            .returns({
                then: function (callback) {
                    callback({ RowKey: "lucas", filledname: "lucas", phone: "123456" })
                    return {
                        catch: x => ({
                            finally: cb => cb()
                        })
                    }
                }
            })

        bot.dialog('/', [
            session => session.beginDialog('SearchDialog'),
            session => session.send('done')
        ]);

        bot.dialog('SearchDialog', searchDialog.callback);
        bot.dialog('HelpDialog', function () { });
        bot.dialog('SomethingElseDialog', function () { });

        bot.on('send', (message) => {
            switch (++step) {
                case 1:
                    expect(message.text).to.equal('Whats the name of the person you seek?');
                    connector.processMessage('lucas');
                    break;
                case 2:
                    expect(message.text).to.equal('Alright, just one second, searching for lucas...');
                    break;
                case 3:
                    expect(message.text).to.equal('Here you are: lucas | 123456');
                    break;
                case 4:
                    expect(message.text).to.equal('done');
                    done();
                    break;
                default:
                    break;
            }
        });

        connector.processMessage('I want to find a person');

    }).timeout(20000);

});