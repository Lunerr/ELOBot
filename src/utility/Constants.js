class Constants {
  constructor() {
    this.data = {
      colors: {
        ban: [234, 12, 0],
        clear: [0, 29, 255],
        defaults: [
          [255, 38, 154],
          [0, 255, 0],
          [0, 232, 40],
          [8, 248, 255],
          [242, 38, 255],
          [255, 28, 142],
          [104, 255, 34],
          [255, 190, 17],
          [41, 84, 255],
          [150, 36, 237],
          [168, 237, 0]
        ],
        chill: [255, 92, 17],
        error: [255, 0, 0],
        kick: [232, 81, 31],
        mute: [255, 114, 14],
        unban: [19, 255, 25],
        unmute: [109, 237, 94],
        unchill: [91, 283, 53],
        warn: [255, 182, 32]
      },

      misc: {
        clientOptions: {
          fetchAllMembers: true,
          messageCacheMaxSize: 100,
          messageCacheLifetime: 30,
          messageSweepInterval: 1800,
          disabledEvents: [
            'CHANNEL_PINS_UPDATE',
            'MESSAGE_UPDATE',
            'MESSAGE_REACTION_ADD',
            'MESSAGE_REACTION_REMOVE',
            'MESSAGE_REACTION_REMOVE_ALL',
            'VOICE_STATE_UPDATE',
            'TYPING_START',
            'VOICE_SERVER_UPDATE',
            'WEBHOOKS_UPDATE'
          ]
        },
        game: '=help',
        prefix: '=',
        botOwners: ['Luner#0059'],
        ownerIds: ['226736342745219072', '316907525574230016']
      },

      regexes: {
        capitalize: /\w\S*/g,
        escape: /[-[\]{}()*+?.,\\/^$|#\s]/g,
        prefix: /^\=/
      }
    };

    this.config = {
      hostSelector: {
        mostWins: Symbol(),
        mostPoints: Symbol(),
        highestWinLoss: Symbol(),
        random: Symbol(),
        none: Symbol()
      },

      pickMode: {
        completeRandom: Symbol(),
        captains: Symbol(),
        soryByScore: Symbol(),
        pick2: Symbol()
      },

      captainSort: {
        mostWins: Symbol(),
        mostPoints: Symbol(),
        highestWinLoss: Symbol(),
        random: Symbol(),
        randomTop4MostPoints: Symbol(),
        randomTop4MostWins: Symbol(),
        randomTop4HighestWinLoss: Symbol()
      },

      mapSelector: {
        cycle: Symbol(),
        random: Symbol(),
        noRepeat: Symbol(),
        none: Symbol()
      },

      result: {
        team1: Symbol(),
        team2: Symbol(),
        undecided: Symbol(),
        canceled: Symbol()
      },

      chill: {
        max: 3600,
        min: 5,
        defaultValue: 30
      },

      clear: {
        max: 100,
        min: 2,
        cooldown: 1000
      },

      mute: {
        defaultLength: 24
      }
    };

    this.conversions = {
      secondInMs: 1000,
      minuteInMs: 60000,
      hourInMs: 3600000,
      dayInMs: 86400000,
      weekInMs: 604800000,
      monthInMs: 2592000000,
      yearInMs: 31536000000,
      decadeInMs: 315360000000,
      centuryInMs: 3153600000000
    };
  }
}

module.exports = new Constants();
