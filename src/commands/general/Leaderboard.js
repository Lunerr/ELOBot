const patron = require('patron.js');

class Leaderboard extends patron.Command {
  constructor() {
    super({
      names: ['leaderboard', 'lb', 'highscores', 'highscore'],
      groupName: 'general',
      description: 'View the highest scored players.',
      args: [
        new patron.Argument({
          name: 'leaderboard',
          key: 'leaderboard',
          type: 'string',
          example: '5v5s'
        })
      ]
    });
  }

  async run(msg, args) {
    const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: args.leaderboard });

    if (leaderboard === null) {
      return msg.createErrorReply('this leaderboard does not exist.');
    }

    const dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.leaderboard);
    const users = dbLeaderboard.users;

    users.sort((a, b) => b.points - a.points);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > 20) {
        break;
      }

      const dbUser = await msg.client.db.userRepo.getUser(users[i].userId, msg.guild.id);

      if (dbUser.registered === false) {
        continue;
      }

      message += i + 1 + '. ' + dbUser.username.boldify() + ': ' + users[i].points + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Highest Points' });
  }
}

module.exports = new Leaderboard();
