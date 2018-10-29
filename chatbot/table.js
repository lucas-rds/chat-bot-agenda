const azure = require('azure-storage');
const tableService = azure.createTableService('agendapocbottable',
    '47oJS/A20WQrjEQaLo6g5fsm5f3yK2pIh7mDFdoJ3ysgrKcVEDahAnbDkF4hqbFrswNuQLXe8UxmMk3Ve9OlrA==');

// tableService.createTableIfNotExists(TABLE_NAME, function (error, result, response) {
//     if (error) { throw "Erro ao criar tabela -- " + JSON.stringify(error) }
// });

module.exports = { tableService }