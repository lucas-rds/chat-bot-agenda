let sinon = require('sinon');
let { expect } = require('chai');
let builder = require('botbuilder');
let bot = require('../../chatbot/bot');

describe('Bot Test', () => {
    let connector;
    let mockStub;
    before(() => {
        connector = new builder.ConsoleConnector();
    })

    after(() => {
        mockStub.restore();
    })

    it('Should create bot', function (done) {
        let mockBot = {
            set: (name, cb) => { },
            recognizer: (recognizer) => { },
            dialog: (dialogName, cb) => {
                return {
                    triggerAction: () => {
                        return {
                            reloadAction: () => { },
                            cancelAction: () => { },
                            endConversationAction: () => { },
                        }
                    }
                }
            }
        }

        mockStub = sinon.stub(builder, 'UniversalBot')
            .returns(mockBot);

        let testBot = bot.create(connector);
        expect(testBot).to.equal(mockBot);

        done();
    });
});