const builder = require('botbuilder');
const service = require('../service');
const { extractFirstEntity } = require('../util/extract-entity');
const { typing, finishAndAskElse, errorDialog } = require('../util/session');

module.exports = {
    name: 'DeleteDialog',
    trigger: { matches: 'Delete' },
    callback: [
        function askPersonName(session, args, next) {
            extractFirstEntity(args)
                .then(entity => {
                    session.dialogData.personName = entity;
                    next();
                })
                .catch(notFound =>
                    builder.Prompts.text(session, "Who do you want to delete?"));
        },
        function findAndConfirm(session, result) {
            let contactName = session.dialogData.personName || result.response;
            service.queryContact(session.message.user.id, contactName)
                .then(contact => {
                    session.dialogData.person = { name: contactName }
                    builder.Prompts.confirm(session, `Are you sure you want to delete this contact? ${contact.filledname}, ${contact.phone}.`);
                })
                .catch(err => finishAndAskElse(session, `Sorry, was not able to find ${contactName} :(`))
        },
        function saveConfirmedUser(session, result) {
            session.send(`Ok then, deleting from phonebook...`);
            typing(session, 5000)
                .then(() => {
                    let userId = String(session.message.user.id);
                    let contact = session.dialogData.person;
                    service.deleteContact(userId, contact.name)
                        .then((err, result, response) => {
                            if (err) return errorDialog(session, err);
                            session.send(`${contact.name} deleted succefully! :)`);
                            finishAndAskElse(session);
                        });
                })

        }
    ],
}