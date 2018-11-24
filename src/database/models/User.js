class User {
  constructor(userId, guildId) {
    this.userId = userId;
    this.guildId = guildId;
    
    this.username = null;
    this.registered = false;
    this.displayedLb = null;

    this.ban = {
      banned: false,
      reason: null,
      expireTime: null,
      moderator: null
    }
  }
}

module.exports = User;
