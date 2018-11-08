const patron = require('patron.js');
const { MessageEmbed } = require('discord.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const RankService = require('../../services/RankService.js');

class User extends patron.Command {
  constructor() {
    super({
      names: ['getuser', 'userstats', 'statsuser', 'user', 'userinfo'],
      groupName: 'system',
      description: 'Get information about the specified user profile.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    
    if (dbUser.registered === false)
    {
      return msg.createErrorReply('user is not registered.');
    }

    const embed = new MessageEmbed()
      .setColor(Random.arrayElement(Constants.data.colors.defaults))
      .setTitle(dbUser.username + ' Profile')
      .addField("Points", dbUser.score.points, true)
      .addField("Rank", RankService.getRank(dbUser, msg.dbGuild, msg.guild), true)
      .addField("Games", "**Games Played**\n" +
        dbUser.score.gamesPlayed + '\n' +
        "**Wins**\n" +
        dbUser.score.wins + '\n' +
        "**Losses**\n" +
        dbUser.score.losses + '\n' +
        "**WLR**\n" +
        (dbUser.score.wins / dbUser.score.losses), true);

    if (msg.dbGuild.settings.useKD) {
      embed.addField("K/D", "**Kills**\n" +
        dbUser.score.kills + '\n' +
        "**Deaths**\n" +
        dbUser.score.deaths + '\n' +
        "**KDR**\n" +
        (dbUser.score.kills / dbUser.score.deaths), true);
    }

    return msg.channel.send({ embed });
  }
}

module.exports = new User();
