const client = jest.createMockFromModule('@slack/client');

client.IncomingWebhook.prototype.send = (message, callback) => {
  process.nextTick(() => {
    callback(null, 'slack message sent');
  });
};

module.exports = client;