const patron = require('patron.js');

class ModifyWins extends patron.Command {
  constructor() {
    super({
      names: ['modifywins', 'modwins'],
      groupName: 'owners',
      description: 'Allows you to modify the wins of any member.',
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
    const wins = 'score.wins';

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { [wins]: args.amount }});

    const newDbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' wins to ' + newDbUser.score.wins + '.');
  }
}

module.exports = new ModifyWins();
