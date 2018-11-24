const patron = require('patron.js');

class ModifyPoints extends patron.Command {
  constructor() {
    super({
      names: ['modifypoints', 'modpoints'],
      groupName: 'owners',
      description: 'Allows you to modify the points of any member.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '500'
        }),
        new patron.Argument({
          name: 'leaderboard',
          key: 'leaderboard',
          type: 'string',
          example: '5v5s'
        }),
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Supa Hot Fire#0911',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const leaderboard = await msg.client.db.leaderboardRepo.findOne({ guildId: msg.guild.id, name: args.leaderboard });

    if (leaderboard === null) {
      return msg.createErrorReply('this leaderboard doesn\'t exist.');
    }
    
    const dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.leaderboard);
    const lbUser = dbLeaderboard.users.find(x => x.userId === args.member.id);

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'users': lbUser } });

    lbUser.points = lbUser.points + args.amount;

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': lbUser} });

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' points to ' + lbUser.points + '.');
  }
}

module.exports = new ModifyPoints();
