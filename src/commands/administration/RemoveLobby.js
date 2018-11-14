const patron = require('patron.js');

class RemoveLobby extends patron.Command {
  constructor() {
    super({
      names: ['removelobby'],
      groupName: 'administration',
      description: 'Removes a lobby channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Pugs',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, { $set: { 'isALobby': false } });

    return msg.createReply('you have successfully removed ' + args.channel.toString() + ' as a lobby.');
  }
}

module.exports = new RemoveLobby();
