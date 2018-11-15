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
        game: '+help',
        prefix: '+',
        botOwners: ['Luner#0059'],
        ownerIds: ['226736342745219072', '316907525574230016']
      },

      regexes: {
        capitalize: /\w\S*/g,
        escape: /[-[\]{}()*+?.,\\/^$|#\s]/g,
        prefix: /^\+/
      }
    };

    this.config = {
      hostSelector: {
        mostWins: 'mostWins',
        mostPoints: 'mostPoints',
        highestWinLoss: 'highestWinLoss',
        random: 'random',
        none: 'none'
      },

      pickMode: {
        completeRandom: 'completeRandom',
        captains: 'captains',
        soryByScore: 'soryByScore',
        pick2: 'pick2'
      },

      captainSort: {
        mostWins: 'mostWins',
        mostPoints: 'mostPoints',
        highestWinLoss: 'highestWinLoss',
        random: 'random',
        randomTop4MostPoints: 'randomTop4MostPoints',
        randomTop4MostWins: 'randomTop4MostWins',
        randomTop4HighestWinLoss: 'randomTop4HighestWinLoss'
      },

      mapSelector: {
        cycle: 'cycle',
        random: 'random',
        noRepeat: 'noRepeat',
        none: 'none'
      },

      result: {
        team1: 'team1',
        team2: 'team2',
        undecided: 'undecided',
        canceled: 'canceled'
      },

      currentGame: {
        isPickingTeams: false,
        queuedPlayerIDs: [],
        pickIndex: 0,
  
        team1: {
          players: [],
          captain: null,
          turnToPick: false
        },
  
        team2: {
          players: [],
          captain: null,
          turnToPick: false
        }
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
