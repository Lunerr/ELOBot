const patron = require('patron.js');
const Random = require('../../utility/Random.js');

class MapList extends patron.Command {
  constructor() {
    super({
      names: ['maps', 'maplist'],
      groupName: 'general',
      description: 'Shows all of the lobby\'s maps.'
    });
  }

  async run(msg) {
    if (msg.dbLobby.isALobby === false) {
      return msg.createErrorReply('this channel isn\'t a lobby.');
    }
    
    let message = '';

    for (let i = 0; i < msg.dbLobby.maps.length; i++) {
      message += msg.dbLobby.maps[i] + ', ';
    }

    return msg.channel.createMessage(message.substring(0, message.length - 2), { title: msg.channel.name + '\'s maps' });
  }
}

module.exports = new MapList();
