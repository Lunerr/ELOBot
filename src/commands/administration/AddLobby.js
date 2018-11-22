const patron = require('patron.js');

class SetLobby extends patron.Command {
  constructor() {
    super({
      names: ['setlobby'],
      groupName: 'administration',
      description: 'Sets a lobby channel.',
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
    await msg.client.db.lobbyRepo.upsertLobby(args.channel.id, { $set: { 'isALobby': true } });

    return msg.createReply('you have successfully set ' + args.channel.toString() + ' as a lobby.');
  }
}

module.exports = new SetLobby();
