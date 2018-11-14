const patron = require('patron.js');

class DelMap extends patron.Command {
  constructor() {
    super({
      names: ['deletemap', 'delmap'],
      groupName: 'administration',
      description: 'Remove a map to the current lobby.',
      args: [
        new patron.Argument({
          name: 'map',
          key: 'map',
          type: 'string',
          example: 'legends'
        })
      ]
    });
  }

  async run(msg, args) {
    const update = new msg.client.db.updates.Pull('maps', args.map);

    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);

    return msg.createReply('you have successfully removed the map ' + args.map.bolidfy() + ' from this lobby.');
  }
}

module.exports = new DelMap();
