const BaseRepository = require('./BaseRepository.js');
const LeaderboardQuery = require('../queries/LeaderboardQuery.js');
const Leaderboard = require('../models/Leaderboard.js');

class LeaderboardRepository extends BaseRepository {
  anyLeaderboard(guildId, name) {
    return this.any(new LeaderboardQuery(guildId, name));
  }

  async getLeaderboard(guildId, name) {
    const query = new LeaderboardQuery(guildId, name);
    const fetchedLeaderboard = await this.findOne(query);

    return fetchedLeaderboard ? fetchedLeaderboard : this.findOneAndReplace(query, new Leaderboard(guildId, name));
  }

  updateLeaderboard(guildId, name, update) {
    return this.updateOne(new LeaderboardQuery(guildId, name), update);
  }

  findLeaderboardAndUpdate(guildId, name, update) {
    return this.findOneAndUpdate(new LeaderboardQuery(guildId, name), update);
  }

  async upsertLeaderboard(guildId, name, update) {
    if (await this.anyLeaderboard(guildId, name)) {
      return this.updateLeaderboard(guildId, name, update);
    }

    return this.updateOne(new Leaderboard(guildId, name), update, true);
  }

  async findLeaderboardAndUpsert(guildId, name, update) {
    if (await this.anyLeaderboard(guildId, name)) {
      return this.findLeaderboardAndUpdate(guildId, name, update);
    }

    return this.findOneAndUpdate(new Leaderboard(guildId, name), update, true);
  }

  deleteLeaderboard(guildId, name) {
    return this.deleteOne(new LeaderboardQuery(guildId, name));
  }
}

module.exports = LeaderboardRepository;
