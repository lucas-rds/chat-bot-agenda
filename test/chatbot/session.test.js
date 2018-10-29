let sinon = require('sinon');
let { expect } = require('chai');
let session = require('../../chatbot/util/session');

describe('Service test', () => {

    let sendMock;
    let sendDialogMock;
    let beginDialogMock;
    let subSessionStub;

    beforeEach(() => {
        subSessionStub = {
            send: function () { },
            sendTyping: function () { },
            endDialog: function () { },
            beginDialog: function () { },
        }
    })

    it('Should finishAndAskElse', function (done) {
        sendDialogMock = sinon.stub(subSessionStub, 'endDialog');
        beginDialogMock = sinon.stub(subSessionStub, 'beginDialog');

        session.finishAndAskElse(subSessionStub);

        expect(sendDialogMock.called).to.be.true;
        expect(beginDialogMock.called).to.be.true;

        sendDialogMock.restore();
        beginDialogMock.restore();
        done();
    });

    it('Should show error dialog', function (done) {
        sendMock = sinon.stub(subSessionStub, 'send');
        sendDialogMock = sinon.stub(subSessionStub, 'endDialog');
        beginDialogMock = sinon.stub(subSessionStub, 'beginDialog');

        session.errorDialog(subSessionStub, null);

        expect(sendMock.called).to.be.true;
        expect(sendDialogMock.called).to.be.true;
        expect(beginDialogMock.called).to.be.true;

        sendMock.restore();
        sendDialogMock.restore();
        beginDialogMock.restore();

        done();
    });

    it('Should send Typing', function (done) {
        let sendTypeMock = sinon.stub(subSessionStub, 'sendTyping');

        session.typing(subSessionStub, 200);

        expect(sendTypeMock.called).to.be.true;

        done();
    });

});