const builder = require('botbuilder');
const service = require('../service');
const { extractFirstEntity } = require('../util/extract-entity');

module.exports = {
    name: 'SearchDialog',
    trigger: { matches: 'Search' },
    callback: [
        function askPersonName(session, args, next) {
            extractFirstEntity(args)
                .then(entity => {
                    session.dialogData.personName = entity;
                    next();
                })
                .catch(notFound => {
                    builder.Prompts.text(session, "Whats the name of the person you seek?")
                });
        },
        function confirmNameAndNumber(session, result) {
            let name = session.dialogData.personName || result.response;
            
            session.send(`Alright, just one second, searching for ${name}...`);
            service.queryContact(session.message.user.id, name)
                .then(contact => session.send(`Here you are: ${contact.filledname} | ${contact.phone}`))
                .catch(err => session.send("Sorry, I couldn't find this person :("))
                .finally(() => {
                    session.endDialog();
                    session.beginDialog("SomethingElseDialog");
                })
        },
    ],
}