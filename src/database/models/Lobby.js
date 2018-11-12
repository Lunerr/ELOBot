const Constants = require('../../utility/Constants.js');

class Lobby {
  constructor(channelId) {
    this.channelId = channelId;
    
    this.userLimit = 10;
    this.description = null;
    this.gamesPlayed = 0;

    this.hostSelectionMode = Constants.config.hostSelector.mostPoints;
    this.mapMode = Constants.config.mapSelector.random;

    this.maps = [];

    this.pickMode = Constants.config.pickMode.completeRandom;
    this.captainSortMode = Constants.config.captainSort.mostPoints;

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
