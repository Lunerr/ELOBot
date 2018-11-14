const patron = require('patron.js');

class ModifyKills extends patron.Command {
  constructor() {
    super({
      names: ['modifykills', 'modkills'],
      groupName: 'owners',
      description: 'Allows you to modify the kills of any member.',
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
    const kills = 'score.kills';

    await msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, { $set: { [kills]: args.amount }});

    const newDbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' kills to ' + newDbUser.score.kills + '.');
  }
}

module.exports = new ModifyKills();
