const builder = require('botbuilder');

let optionsMap = {
    "search": "SearchDialog",
    "add": "AddDialog",
    "edit": "EditDialog",
    "delete": "DeleteDialog"
}

module.exports = {
    name: 'HelpDialog',
    trigger: { matches: 'Help' },
    callback: [
        function one(session) {
            builder.Prompts.choice(session, "I can do these operations in your contact list:",
                Object.keys(optionsMap),
                { listStyle: 3 });
        },
        function two(session, results) {
            session.endDialog();
            session.beginDialog(optionsMap[results.response.entity]);
        }
    ],
}