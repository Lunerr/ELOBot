const BaseRepository = require('./BaseRepository.js');
const LobbyQuery = require('../queries/LobbyQuery.js');
const Lobby = require('../models/Lobby.js');

class LobbyRepository extends BaseRepository {
  anyLobby(channelId) {
    return this.any(new LobbyQuery(channelId));
  }

  async getLobby(channelId) {
    const query = new LobbyQuery(channelId);
    const fetchedGuild = await this.findOne(query);

    return fetchedGuild ? fetchedGuild : this.findOneAndReplace(query, new Lobby(channelId));
  }

  updateLobby(channelId, update) {
    return this.updateOne(new LobbyQuery(channelId), update);
  }

  findLobbyAndUpdate(channelId, update) {
    return this.findOneAndUpdate(new LobbyQuery(channelId), update);
  }

  async upsertLobby(channelId, update) {
    if (await this.anyLobby(channelId)) {
      return this.updateLobby(channelId, update);
    }

    return this.updateOne(new Lobby(channelId), update, true);
  }

  async findLobbyAndUpsert(channelId, update) {
    if (await this.anyLobby(channelId)) {
      return this.findGuildAndUpdate(channelId, update);
    }

    return this.findOneAndUpdate(new Lobby(channelId), update, true);
  }

  deleteLobby(channelId) {
    return this.deleteOne(new LobbyQuery(channelId));
  }
}

module.exports = LobbyRepository;
