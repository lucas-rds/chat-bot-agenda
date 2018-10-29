const builder = require('botbuilder');
const service = require('../service');
const { typing, finishAndAskElse, errorDialog } = require('../util/session');

module.exports = {
    name: 'AddDialog',
    trigger: { matches: 'Add' },
    callback: [
        function askPersonName(session) {
            session.dialogData.person = {}
            builder.Prompts.text(session, "So you want to add a new person? Please, tell me the person name.")
        },
        function askPhone(session, result) {
            session.dialogData.person.name = result.response;
            // builder.Prompts.text(session, `And what is ${result.response} phone number?`);
            session.beginDialog("PhonePrompt");
        },
        function confirmNameAndNumber(session, result) {
            session.dialogData.person.phone = result.response;
            let person = session.dialogData.person;
            builder.Prompts.confirm(session, `So, is this correct? ${person.name}, ${person.phone}.`);
        },
        function saveConfirmedUser(session, result) {
            if (!result.response) return finishAndAskElse(session, `Ok then, canceling!`);

            session.send(`Ok then, saving this person in your phonebook...`);
            typing(session, 5000).then(() => {
                let userId = session.message.user.id;
                let contact = session.dialogData.person;
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