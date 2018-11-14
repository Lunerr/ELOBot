const { MongoClient } = require('mongodb');
const util = require('util');
const UserRepository = require('./repositories/UserRepository.js');
const GuildRepository = require('./repositories/GuildRepository.js');
const LobbyRepository = require('./repositories/LobbyRepository.js');
const GameResultRepository = require('./repositories/GameResultRepository.js');

class Database {
  constructor() {
    this.queries = {
      Id: require('./queries/IdQuery.js'),
      Guild: require('./queries/GuildQuery.js'),
      User: require('./queries/UserQuery.js'),
      Lobby: require('./queries/LobbyQuery.js'),
      GameResult: require('./queries/GameResultQuery.js')
    };

    this.updates = {
      Pull: require('./updates/PullUpdate.js'),
      Push: require('./updates/PushUpdate.js')
    };

    this.models = {
      Guild: require('./models/Guild.js'),
      User: require('./models/User.js'),
      Lobby: require('./models/Lobby.js'),
      GameResult: require('./models/GameResult.js')
    };
  }

  async connect(connectionURL) {
    const promisified = util.promisify(MongoClient.connect);
    const connection = await promisified(connectionURL, { useNewUrlParser: true });
    const db = connection.db(connection.s.options.dbName);

    this.guildRepo = new GuildRepository(await db.createCollection('guilds'));
    this.userRepo = new UserRepository(await db.createCollection('users'));
    this.lobbyRepo = new LobbyRepository(await db.createCollection('lobby'));
    this.gameResultRepo = new GameResultRepository(await db.createCollection('gameresult'));

    await db.collection('lobby').createIndex('channelId', { unique: true });
    await db.collection('guilds').createIndex('guildId', { unique: true });
  }
}

module.exports = Database;
