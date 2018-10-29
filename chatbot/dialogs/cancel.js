module.exports = {
    name: 'CancelDialog',
    trigger: { matches: 'Cancel' },
    callback: session => {
        session.send(`Cancelling...`);
        session.endDialog();
        session.beginDialog("SomethingElseDialog");
    },
}