const BaseRepository = require('./BaseRepository.js');
const GameResultQuery = require('../queries/GameResultQuery.js');
const GameResult = require('../models/GameResult.js');

class GameResultRepository extends BaseRepository {
  anyGameResult(lobbyId, gameNumber) {
    return this.any(new GameResultQuery(lobbyId, gameNumber));
  }

  async getGameResult(lobbyId, gameNumber) {
    const query = new GameResultQuery(lobbyId, gameNumber);
    const fetchedGuild = await this.findOne(query);

    return fetchedGuild ? fetchedGuild : this.findOneAndReplace(query, new GameResult(lobbyId, gameNumber));
  }

  updateGameResult(lobbyId, gameNumber, update) {
    return this.updateOne(new GameResultQuery(lobbyId, gameNumber), update);
  }

  findGameResultAndUpdate(lobbyId, gameNumber, update) {
    return this.findOneAndUpdate(new GameResultQuery(lobbyId, gameNumber), update);
  }

  async upsertGameResult(lobbyId, gameNumber, update) {
    if (await this.anyGameResult(lobbyId, gameNumber)) {
      return this.updateGameResult(lobbyId, gameNumber, update);
    }

    return this.updateOne(new GameResult(lobbyId, gameNumber), update, true);
  }

  async findGameResultAndUpsert(lobbyId, gameNumber, update) {
    if (await this.anyGameResult(lobbyId, gameNumber)) {
      return this.findGuildAndUpdate(lobbyId, gameNumber, update);
    }

    return this.findOneAndUpdate(new GameResult(lobbyId, gameNumber), update, true);
  }

  deleteGameResult(lobbyId, gameNumber) {
    return this.deleteOne(new GameResultQuery(lobbyId, gameNumber));
  }
}

module.exports = GameResultRepository;
