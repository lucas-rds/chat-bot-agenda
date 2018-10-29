module.exports = (bot, dialogs) =>
    dialogs.map(dialog => {
        return bot.dialog(dialog.name, dialog.callback)
            .triggerAction(dialog.trigger);
    })