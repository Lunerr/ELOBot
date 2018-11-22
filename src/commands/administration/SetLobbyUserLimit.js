const patron = require('patron.js');

class SetLobbyUserLimit extends patron.Command {
  constructor() {
    super({
      names: ['setlobbyuserlimit'],
      groupName: 'administration',
      description: 'Set\'s the lobby\'s limit of users.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Pugs'
        }),
        new patron.Argument({
          name: 'users',
          key: 'users',
          type: 'int',
          example: '13'
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.users <= 0) {
      return msg.createErrorReply('cannot be lower than or equal to 0.');
    } else if (args.users % 2 !== 0) {
      return msg.createErrorReply('users must be an even number.');
    } else if (args.users > 10) {
      return msg.createErrorReply('cannot be higher than 10.');
    }

    await msg.client.db.lobbyRepo.upsertLobby(args.channel.id, { $set: { 'userLimit': args.users } });

    return msg.createReply('you have successfully set ' + args.channel.toString() + ' user limit to ' + args.users + '.');
  }
}

module.exports = new SetLobbyUserLimit();
