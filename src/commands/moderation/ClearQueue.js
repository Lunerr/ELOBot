const patron = require('patron.js');

class ClearQueue extends patron.Command {
  constructor() {
    super({
      names: ['clearqueue'],
      groupName: 'moderation',
      description: 'Clears the lobby\'s queue.'
    });
  }

  async run(msg, args) {
    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'currentGame.queuedPlayerIDs': [] } });

    return msg.createReply('you have successfully cleared the queue.');
  }
}

module.exports = new ClearQueue();
