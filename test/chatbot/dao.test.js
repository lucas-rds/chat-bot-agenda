let sinon = require('sinon');
let { expect } = require('chai');
let dao = require('../../chatbot/dao');
const { tableService } = require('../../chatbot/table')

describe('DAO test', () => {

    let mockContact;
    let mock;
    before(() => {
        mockContact = {
            name: "lucas",
            phone: "123"
        }
    })

    after(() => {
        mock.restore();
    })

    it('Should insert', function (done) {
        mock = sinon.stub(tableService, 'insertOrReplaceEntity')
            .yields(mockContact);
        dao.insertContact("ID", "lucas", function (result) {
            expect(result).to.equal(mockContact);
            expect(mock.called).to.true;
            done();
        })
    });

    it('Should get', function (done) {
        mock = sinon.stub(tableService, 'retrieveEntity')
            .yields(null, null, { body: mockContact });
        dao.queryContact("ID", "lucas", function (err, result) {
            expect(result).to.equal(mockContact);
            expect(mock.called).to.true;
            done();
        })
    });

    it('Should delete', function (done) {
        mock = sinon.stub(tableService, 'deleteEntity')
            .yields(mockContact);
        dao.deleteContact({phone:"ID", name:"lucas"}, function (result) {
            expect(result).to.equal(mockContact);
            expect(mock.called).to.true;
            done();
        })
    });
});