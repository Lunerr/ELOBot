class Guild {
  constructor(guildId) {
    this.guildId = guildId;

    this.roles = {
      mod: [],
      rank: [],
      muted: null,
      reporters: null,
      registered: null
    };

    this.channels = {
      announcementsChannel: null
    };

    this.settings = {
      messageMultiplier: 1,
      dmAnnouncements: false,
      removeOnAfk: true,
      blockMultiQueuing: true,
      allowNegativeScore: false,
      allowUserSubmissions: false,
      requeueDelay: 0,
      useKD: false
    };

    this.registration = {
      message: 'Thank you for registering!',
      registrationBonus: 0,
      allowMultiRegistration: true,
      nameFormat: '[{0}] - {1}'
    };
    
    this.misc = {
      caseNumber: 1
    };
  }
}

module.exports = Guild;
