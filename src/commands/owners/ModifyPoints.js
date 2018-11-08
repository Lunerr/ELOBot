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
    const points = 'score.points';

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { [points]: args.amount }});

    const newDbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' points to ' + newDbUser.score.points + '.');
  }
}

module.exports = new ModifyPoints();
