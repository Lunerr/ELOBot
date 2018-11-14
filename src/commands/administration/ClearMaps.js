const patron = require('patron.js');

class ClearMaps extends patron.Command {
  constructor() {
    super({
      names: ['clearmaps'],
      groupName: 'administration',
      description: 'Remove all maps from the current lobby.'
    });
  }

  async run(msg, args) {
    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'maps': [] } });

    return msg.createReply('Map List for this lobby has been reset.');
  }
}

module.exports = new ClearMaps();
