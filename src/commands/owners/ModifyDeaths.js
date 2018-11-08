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
    const deaths = 'score.deaths';

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { [deaths]: args.amount }});

    const newDbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' deaths to ' + newDbUser.score.deaths + '.');
  }
}

module.exports = new ModifyDeaths();
