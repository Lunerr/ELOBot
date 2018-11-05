const Constants = require('../../utility/Constants.js');

class GameResult {
  constructor(lobbyId) {
    this.lobbyId = lobbyId;
    this.result = Constants.config.result.undecided;

    this.dateTime = Date.now();

    this.gameNumber = null;

    this.team1 = [];
    this.team2 = [];

    this.proposal = {
      p1: 0,
      r1: Constants.result.undecided,
      p2: 0,
      r2: Constants.result.undecided
    };

    this.comments = {
      id: 1,
      commenterId: null,
      content: null
    }
  }
}

module.exports = GameResult;
