const patron = require('patron.js');

class AddMap extends patron.Command {
  constructor() {
    super({
      names: ['addmap'],
      groupName: 'administration',
      description: 'Add a map to the current lobby.',
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
    const update = new msg.client.db.updates.Push('maps', args.map);

    await msg.client.db.lobbyRepo.upsertLobby(msg.channel.id, update);

    return msg.createReply('you have successfully added the map ' + args.map.bolidfy() + ' to this lobby.');
  }
}

module.exports = new AddMap();
