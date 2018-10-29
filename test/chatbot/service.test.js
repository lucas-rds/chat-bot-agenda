let sinon = require('sinon');
let { expect } = require('chai');
let service = require('../../chatbot/service');
let dao = require('../../chatbot/dao');

describe('Service test', () => {

    let mock;
    let userId;
    let mockContact;
    before(() => {
        userId = "ID";
        mockContact = {
            name: "lucas",
            phone: "123"
        }
    })

    after(() => {
        mock.restore();
    })

    it('Should insert', function (done) {
        mock = sinon.stub(dao, 'insertContact')
            .yields(mockContact);
        service.insertContact(userId, mockContact)
            .then(result => {
                expect(result).to.equal(mockContact);
                done();
            })
    });

    it('Should get', function (done) {
        mock = sinon.stub(dao, 'queryContact')
            .yields(null, mockContact);
        service.queryContact(userId, mockContact.name)
            .then(result => {
                expect(result).to.equal(mockContact);
                done();
            })
    });

    it('Should delete', function (done) {
        mock = sinon.stub(dao, 'deleteContact')
            .yields(mockContact);
        service.deleteContact(userId, mockContact.name)
            .then(result => {
                expect(result).to.equal(mockContact);
                done();
            })
    });
});