const patron = require('patron.js');

class Leaderboards extends patron.Command {
  constructor() {
    super({
      names: ['leaderboards', 'lbs'],
      groupName: 'general',
      description: 'View the guild\'s leaderboards.'
    });
  }

  async run(msg) {
    const leaderboards = await msg.client.db.leaderboardRepo.findMany({ guildId: msg.guild.id });
    let message = '';

    for (let i = 0; i < leaderboards.length; i++) {
      if (i + 1 > 20) {
        break;
      }

      message += leaderboards[i].name + ', ';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is no leaderboards set.');
    }

    return msg.channel.createMessage(message, { title: msg.guild.name + '\'s leaderboards' });
  }
}

module.exports = new Leaderboards();
