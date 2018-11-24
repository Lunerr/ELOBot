const patron = require('patron.js');

class RemoveLeaderboard extends patron.Command {
  constructor() {
    super({
      names: ['removeleaderboard', 'deleteleaderboard', 'removelb', 'deletelb'],
      groupName: 'administration',
      description: 'Remove a leaderboard.',
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

    if (leaderboard === null) {
      return msg.createErrorReply('this leaderboard doesn\'t exist.');
    }

    await msg.client.db.leaderboardRepo.deleteLeaderboard(msg.guild.id, args.name)

    return msg.createReply('you have successfully removed leaderboard ' + args.name + '.');
  }
}

module.exports = new RemoveLeaderboard();
