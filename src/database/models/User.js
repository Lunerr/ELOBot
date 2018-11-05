class User {
  constructor(userId, guildId) {
    this.userId = userId;
    this.guildId = guildId;
    this.score = {
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      kills: 0,
      deaths: 0,
      gamesPlayed: 0
    };
  }
}

module.exports = User;
