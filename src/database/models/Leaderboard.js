class Leaderboard {
  constructor(guildId, name) {
    this.guildId = guildId;
    this.name = name;

    this.lobbies = [];
    this.users = [];
  }
}

module.exports = Leaderboard;
