const builder = require('botbuilder');

module.exports = {
    name: 'PhonePrompt',
    trigger: {},
    callback: [
        function (session, args) {
            if (args && args.reprompt) {
                builder.Prompts.text(session, "Please, enter a valid phone number, something like: '(555) 91234-5678' or '123456789'")
            } else {
                builder.Prompts.text(session, "What's the phone number?");
            }
        },
        function (session, results) {
            let matched = results.response.match(/\d+/g);
            let number = matched ? matched.join('') : '';
            if (number.length >= 8) {
                session.userData.phoneNumber = number;
                session.endDialogWithResult({ response: number });
            } else {
                session.replaceDialog('PhonePrompt', { reprompt: true });
            }
        }
    ]
}