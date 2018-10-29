
const botbuilder_azure = require("botbuilder-azure");
const azureTableClient = new botbuilder_azure.AzureTableClient('botdata', process.env['AzureWebJobsStorage']);
const tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

module.exports = tableStorage;