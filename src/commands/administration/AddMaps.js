const patron = require('patron.js');

class AddMaps extends patron.Command {
  constructor() {
    super({
      names: ['addmaps'],
      groupName: 'administration',
      description: 'Add multiple maps to the current lobby.',
      args: [
        new patron.Argument({
          name: 'maps',
          key: 'maps',
          type: 'string',
          example: 'legends,yeet,striker'
        })
      ]
    });
  }

  async run(msg, args) {
    const maps = args.maps.split(',');
    let reply = '';

    for (let i = 0; i < maps.length; i++) {
      const newLobby = await msg.client.db.lobbyRepo.getLobby(msg.channel.id);

      if (newLobby.maps.includes(maps[i])) {
        return msg.createErrorReply('map ' + maps[i] + ' already exists in the lobby.');
      }

      const update = new msg.client.db.updates.Push('maps', maps[i]);

      await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);

      reply += maps[i] + ', ';
    }

    console.log('3');

    return msg.channel.createMessage('Success, Lobby Map list is now:\n' + reply.substring(0, reply.length - 2));
  }
}

module.exports = new AddMaps();
