const { tableService } = require('./table')
const entityGenerator = require('azure-storage').TableUtilities.entityGenerator;

const TABLE_NAME = 'contacts';

const insertContact = (userId, contactEntity, callback) => {
    tableService.insertOrReplaceEntity(TABLE_NAME, contactEntity, callback);
}

const queryContact = (userId, contactName, callback) => {
    tableService.retrieveEntity(TABLE_NAME, userId, contactName, (err, result, response) => {
        callback(err, response.body)
    });
}

const deleteContact = (contactEntity, callback) => {
    tableService.deleteEntity(TABLE_NAME, contactEntity, callback);
}

// let contact = { name: "Lucas", phone: "123123" }

// insertContact("1", contact, (err, result, response) =>{

// })

// queryContact("1", contact.name, (err, result, response) =>{
//     console.log(response.body);
// })

// deleteContact("1", contact.name, (err, result, response) => {
//     console.log(err);
//     console.log(result);
//     console.log(response);
// })


module.exports = { insertContact, queryContact, deleteContact }