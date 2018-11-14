const Constants = require('../../utility/Constants.js');

class Lobby {
  constructor(channelId) {
    this.channelId = channelId;
    
    this.isALobby = false;
    this.userLimit = 10;
    this.description = null;
    this.gamesPlayed = 1;

    this.maps = [];

    this.mapInfo = {
      lastMapIndex: 0,
      lastMap: null
    }

    this.currentGame = {
      isPickingTeams: false,
      queuedPlayerIDs: [],
      pickIndex: 0,

      team1: {
        players: [],
        captain: null,
        turnToPick: false
      },

      team2: {
        players: [],
        captain: null,
        turnToPick: false
      }
    }
  }
}

module.exports = Lobby;
