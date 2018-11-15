const patron = require('patron.js');

class Leaderboards extends patron.Command {
  constructor() {
    super({
      names: ['leaderboards', 'lb', 'highscores', 'highscore', 'leaderboard'],
      groupName: 'general',
      description: 'View the richest Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });

    users.sort((a, b) => b.score.points - a.score.points);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > 20) {
        break;
      }

      if (users[i].registered === false) {
        continue;
      }

      message += i + 1 + '. ' + users[i].username.boldify() + ': ' + users[i].score.points + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Highest Points' });
  }
}

module.exports = new Leaderboards();
