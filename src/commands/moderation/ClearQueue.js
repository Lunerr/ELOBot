const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class ClearQueue extends patron.Command {
  constructor() {
    super({
      names: ['clearqueue'],
      groupName: 'moderation',
      description: 'Clears the lobby\'s queue.'
    });
  }

  async run(msg, args) {
    const update = {
      $set: {
        'currentGame': Constants.config.currentGame
      }
    };

    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);
    return msg.createReply('you have successfully cleared the queue.');
  }
}

module.exports = new ClearQueue();
