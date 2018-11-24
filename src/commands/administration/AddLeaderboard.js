const patron = require('patron.js');

class AddLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['addleaderboard', 'setleaderboard', 'addlb', 'setlb'],
      groupName: 'administration',
      description: 'Add a leaderboard.',
      args: [
        new patron.Argument({
          name: 'name',
          key: 'name',
          type: 'string',
          example: '5v5s',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: args.name });

    if (leaderboard !== null) {
      return msg.createErrorReply('this leaderboard already exists.');
    }

    await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.name);

    return msg.createReply('you have successfully added leaderboard ' + args.name + '.');
  }
}

module.exports = new AddLeaderboard();
