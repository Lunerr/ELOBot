const Constants = require('../../utility/Constants.js');

class GameResult {
  constructor(lobbyId, gameNumber) {
    this.lobbyId = lobbyId;
    this.gameNumber = gameNumber;
    
    this.result = Constants.config.result.undecided;

    this.dateTime = Date.now();

    this.team1 = [];
    this.team2 = [];

    this.proposal = {
      p1: 0,
      r1: Constants.config.result.undecided,
      p2: 0,
      r2: Constants.config.result.undecided
    };

    this.comments = {
      id: 1,
      commenterId: null,
      content: null
    }
  }
}

module.exports = GameResult;
