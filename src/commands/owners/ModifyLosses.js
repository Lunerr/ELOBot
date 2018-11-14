const patron = require('patron.js');

class ModifyLosses extends patron.Command {
  constructor() {
    super({
      names: ['modifylosses', 'modlosses'],
      groupName: 'owners',
      description: 'Allows you to modify the losses of any member.',
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
    const losses = 'score.losses';

    await msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, { $set: { [losses]: args.amount }});

    const newDbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' losses to ' + newDbUser.score.losses + '.');
  }
}

module.exports = new ModifyLosses();
