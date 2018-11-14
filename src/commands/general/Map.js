const patron = require('patron.js');
const Random = require('../../utility/Random.js');

class Map extends patron.Command {
  constructor() {
    super({
      names: ['map'],
      groupName: 'general',
      description: 'Pick a new map.'
    });
  }

  async run(msg) {
    const map = Random.arrayElement(msg.dbLobby.maps);

    return msg.createReply(map + ' has been chosen.');
  }
}

module.exports = new Map();
