const Promise = require('bluebird')
const hasEntities = (args) => args && args.intent.entities.length > 0;

const extractFirstEntity = (args) => {
    return new Promise((resolve, reject) => {
        return hasEntities(args) ? resolve(args.intent.entities[0].entity) : reject("notFound");
    })
}
module.exports = {
    extractFirstEntity
}