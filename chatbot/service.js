const azure = require('azure-storage');
const entityGenerator = azure.TableUtilities.entityGenerator;
const Promise = require('bluebird');
const dao = require('./dao');

const parseContactToEntity = (userId, contact) => ({
    PartitionKey: entityGenerator.String(userId),
    RowKey: entityGenerator.String(contact.name.toLowerCase()),
    filledname: entityGenerator.String(contact.name),
    phone: entityGenerator.String(contact.phone),
});

const insertContact = (userId, contact) => {
    let contactEntity = parseContactToEntity(userId, contact);
    return new Promise((resolve, reject) => {
        dao.insertContact(userId, contactEntity, resolve);
    })
}

const queryContact = (userId, contactName) => {
    return new Promise((resolve, reject) => {
        dao.queryContact(userId, contactName.toLowerCase(), (err, contact) => {
            if (err) reject(err);
            resolve(contact);
        });
    })
}

const deleteContact = (userId, contact, callback) => {
    let contactEntity = {
        PartitionKey: entityGenerator.String(userId),
        RowKey: entityGenerator.String(contact)
    }
    return new Promise(resolve => {
        dao.deleteContact(contactEntity, resolve)
    })
}

module.exports = { insertContact, queryContact, deleteContact }