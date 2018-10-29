
const builder = require('botbuilder');
const tableStorage = require('./storage');
const recognizer = require('./recognizer-luis');
const registerDialogs = require('./register-dialogs');
const dialogFlow = require('./dialogs');
const dao = require('./dao')

function create(connector) {
    let bot = new builder.UniversalBot(connector, (session, args) => session.send(`Sorry, i dont understand, can you say that again, maybe in other words?`));

    bot.set('storage', tableStorage);
    bot.recognizer(recognizer);

    let registeredDialogs = registerDialogs(bot, dialogFlow);
    registeredDialogs.forEach(dialog => {
        dialog.reloadAction('startOver', 'Ok, starting over.', {
            matches: /^start over$|^start again$|restart/i
        });
        dialog.cancelAction('cancelAction', 'Alright, canceling...', {
            matches: /^nevermind$|^cancel$/i
        });
        dialog.endConversationAction('endConversationAction', 'Ok, see you later!', {
            matches: /^goodbye$|^finish$|^bye bye$|^bye/i
        });
    });

    return bot;
}

module.exports = { create };