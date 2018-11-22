const patron = require('patron.js');

class ModifyDeaths extends patron.Command {
  constructor() {
    super({
      names: ['modifydeaths', 'moddeaths'],
      groupName: 'owners',
      description: 'Allows you to modify the deaths of any member.',
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
    const dbLeaderboard = await msg.client.db.leaderboardRepo.getLeaderboard(msg.guild.id, args.leaderboard);
    const lbUser = dbLeaderboard.users.find(x => x.userId === args.member.id);

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $pull: { 'users': lbUser } });

    lbUser.deaths = lbUser.deaths + args.amount;

    await msg.client.db.leaderboardRepo.upsertLeaderboard(msg.guild.id, dbLeaderboard.name, { $push: { 'users': lbUser} });

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' deaths to ' + lbUser.deaths + '.');
  }
}

module.exports = new ModifyDeaths();
