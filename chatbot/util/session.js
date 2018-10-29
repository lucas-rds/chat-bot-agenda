const Promise = require('bluebird')
const hasEntities = (args) => args && args.intent.entities.length > 0;

const finishAndAskElse = (session, message = false) => {
    if(message) session.send(message);
    session.endDialog();
    session.beginDialog("SomethingElseDialog");
    return;
}

const errorDialog = (session, err) => {
    session.send("A error ocurred: " + JSON.stringify(err));
    session.endDialog();
    session.beginDialog("SomethingElseDialog");
    return;
}

const typing = (session, time) =>{
    return new Promise(resolve => {
        session.sendTyping();
        setTimeout(resolve, time);
    })
}

module.exports = {
    finishAndAskElse,
    errorDialog,
    typing
}