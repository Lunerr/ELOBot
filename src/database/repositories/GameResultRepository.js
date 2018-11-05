const BaseRepository = require('./BaseRepository.js');
const GameResultQuery = require('../queries/GameResultQuery.js');
const GameResult = require('../models/GameResult.js');

class GameResultRepository extends BaseRepository {
  anyGameResult(lobbyId) {
    return this.any(new GameResultQuery(lobbyId));
  }

  async getGameResult(lobbyId) {
    const query = new GameResultQuery(lobbyId);
    const fetchedGuild = await this.findOne(query);

    return fetchedGuild ? fetchedGuild : this.findOneAndReplace(query, new GameResult(lobbyId));
  }

  updateGameResult(lobbyId, update) {
    return this.updateOne(new GameResultQuery(lobbyId), update);
  }

  findGameResultAndUpdate(lobbyId, update) {
    return this.findOneAndUpdate(new GameResultQuery(lobbyId), update);
  }

  async upsertGameResult(lobbyId, update) {
    if (await this.anyGameResult(lobbyId)) {
      return this.updateGameResult(lobbyId, update);
    }

    return this.updateOne(new GameResult(lobbyId), update, true);
  }

  async findGameResultAndUpsert(lobbyId, update) {
    if (await this.anyGameResult(lobbyId)) {
      return this.findGuildAndUpdate(lobbyId, update);
    }

    return this.findOneAndUpdate(new GameResult(lobbyId), update, true);
  }

  deleteGameResult(lobbyId) {
    return this.deleteOne(new GameResultQuery(lobbyId));
  }
}

module.exports = GameResultRepository;
