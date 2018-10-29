const builder = require('botbuilder');
const service = require('../service');
const { extractFirstEntity } = require('../util/extract-entity');
const { typing, finishAndAskElse, errorDialog } = require('../util/session');

module.exports = {
    name: 'EditDialog',
    trigger: { matches: 'Edit' },
    callback: [
        function askPersonName(session, args, next) {
            extractFirstEntity(args)
                .then(entity => {
                    session.dialogData.personName = entity;
                    next();
                })
                .catch(notFound =>
                    builder.Prompts.text(session, "What's the name of the contact you want to edit?"));
        },
        function findAndConfirm(session, result) {
            let contactName = session.dialogData.personName || result.response;
            service.queryContact(session.message.user.id, contactName)
                .then(contact => {
                    session.dialogData.person = { name: contactName }
                    builder.Prompts.confirm(session, `This one? ${contact.filledname}, ${contact.phone}.`);
                })
                .catch(err => finishAndAskElse(session, `Sorry, was not able to find ${contactName} :(`))
        },
        function askPhone(session, result) {
            return result.response ?
                session.beginDialog("PhonePrompt") :
                finishAndAskElse(session, `Ok then, canceling!`);
        },
        function saveConfirmedUser(session, result) {
            session.send(`Ok then, saving this person in your phonebook...`);
            typing(session, 300)
                .then(() => {
                    let userId = session.message.user.id;
                    let contact = session.dialogData.person;
                    contact.phone = result.response;
                    service.insertContact(userId, contact)
                        .then((err, result, response) => {
                            if (err) return errorDialog(session, err);
                            session.send(`${contact.name} saved succefully! :)`);
                            finishAndAskElse(session);
                        });
                })

        }
    ],
}