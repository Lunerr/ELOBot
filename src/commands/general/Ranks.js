const patron = require('patron.js');

class Ranks extends patron.Command {
  constructor() {
    super({
      names: ['ranks'],
      groupName: 'general',
      description: 'View all ranks in this server.'
    });
  }

  async run(msg) {
    if (!msg.dbGuild.roles.rank.length) {
      return msg.createErrorReply('there are no rank roles yet!');
    }

    const sortedRanks = msg.dbGuild.roles.rank.sort((a, b) => a.threshold - b.threshold);

    let description = '`Threshold +Win -Lose`\n';

    for (let i = 0; i < sortedRanks.length; i++) {
      const rank = msg.guild.roles.get(sortedRanks[i].id);

      description += '`' + sortedRanks[i].threshold + ' +' + sortedRanks[i].winsModifier + ' -' + sortedRanks[i].lossModifier + '` - ' + rank.toString() + '\n';
    }

    return msg.channel.createMessage(description, { title: 'Ranks' });
  }
}

module.exports = new Ranks();
